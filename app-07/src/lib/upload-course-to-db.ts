import { Course } from "@/types/draft";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { generateId } from "./generate-id";
import { getCorrectOptionNumber } from "./get-correct-option";
import { getRandomImage } from "./get-random-image";
import { uploadCourse } from "@/actions/course/upload-course";
import { uploadTopics } from "@/actions/course/upload-topics";
import { uploadLevels } from "@/actions/course/upload-levels";
import { uploadGames } from "@/actions/course/upload-games";
import { uploadTiles } from "@/actions/course/upload-tiles";

export default async function uploadCourseToDB(
  data: Course,
  email: string
) {
  /*
   * ============================================================
   * COURSE
   * ============================================================
   */

  const courseId = generateId(data.course_name);

  const course = {
    courseid: courseId,
    order: "",
    name: data.course_name,

    // S3 upload happens before calling this function
    ImageLink: data.ImageLink || getRandomImage(),

    course_tip: data.course_description,
    live: "no",
    email: email,
    action: "create",
  };

  await uploadCourse(course);

  /*
   * ============================================================
   * TOPICS
   * ============================================================
   */

  const TopicMap: Record<string, string> = {};

  const topics = data.modules.map((item, index) => {
    const topicId = generateId(item.module_name);

    TopicMap[item.module_name] = topicId;

    return {
      topic_id: topicId,
      courseid: courseId,
      order: `${index + 1}`,
      name: item.module_name,
      ImageLink: "",
      topic_tip: item.module_description,
      live: "no",
    };
  });

  await uploadTopics({
    topics,
    action: "create",
  });

  /*
   * ============================================================
   * LEVELS
   * ============================================================
   */

  const levelMap: Record<string, string> = {};

  const levels = data.modules.flatMap((item) => {
    const topicId = TopicMap[item.module_name];

    return item.levels.map((level, index) => {
      const levelId = generateId(level.level_name);

      levelMap[`${level.level_name}-${item.module_name}`] = levelId;

      return {
        level_id: levelId,
        topic_id: topicId,
        order: `${index + 1}`,
        name: level.level_name,
        ImageLink: "",
        level_tip: level.level_description,
        live: "no",
      };
    });
  });

  await uploadLevels({
    levels,
    action: "create",
  });

  /*
   * ============================================================
   * GAMES
   *
   * IMPORTANT FOR LUMORA:
   *
   * Preserve:
   * - passage_text
   * - grade_band
   * - difficulty
   * - target_skill
   *
   * These fields are required by the adaptive reading flow.
   * ============================================================
   */

  const gameMap: Record<string, string> = {};

  const games = (
    await Promise.all(
      data.modules.flatMap((item) => {
        return item.levels.flatMap((level) => {
          if (!level.games) return [];

          const levelId =
            levelMap[`${level.level_name}-${item.module_name}`];

          return level.games.map(async (game, index) => {
            const gameId = generateId(game.game_name);

            gameMap[
              `${game.game_name}-${level.level_name}`
            ] = gameId;

            return {
              gameid: gameId,
              level_id: levelId,
              order: `${index + 1}`,
              name: game.game_name,

              ImageLink: getRandomImage(),

              gameTip: game.game_description,
              in_gameTip: "",

              live: "no",

              /*
               * ==================================================
               * LUMORA READING METADATA
               * ==================================================
               */

              passage_text: game.passage_text || "",
              grade_band: game.grade_band || "",
              difficulty: game.difficulty || "",
              target_skill: game.target_skill || "",
            };
          });
        });
      })
    )
  ).flat();

  if (!games.length) {
    return;
  }

  console.log("Triggering recompile. Game payload:", games);

  await uploadGames({
    games,
    action: "create",
  });

  /*
   * ============================================================
   * TILES / QUESTIONS
   *
   * IMPORTANT FOR LUMORA:
   *
   * Preserve:
   * - skill_tag
   * - has_reasoning_prompt
   *
   * skill_tag is used by RecordQuestionAnswer to update
   * UserSkillMastery.
   * ============================================================
   */

  const tiles = data.modules.flatMap((item) => {
    return item.levels.flatMap((level) => {
      if (!level.games) return [];

      return level.games.flatMap((game) => {
        if (!game.questions) return [];

        const gameId =
          gameMap[`${game.game_name}-${level.level_name}`];

        return game.questions.map((tile, index) => {
          /*
          * ======================================================
          * CORRECT OPTION
          * ======================================================
          */

          const correctOption = getCorrectOptionNumber(tile, [
            `${tile?.option1
              ? tile.option1
              : tile.type === "true-false"
                ? "True"
                : ""
            }`,
            `${tile?.option2
              ? tile.option2
              : tile.type === "true-false"
                ? "False"
                : ""
            }`,
            `${tile?.option3 || ""}`,
            `${tile?.option4 || ""}`,
          ]);

          /*
          * ======================================================
          * LUMORA SKILL
          *
          * Primary:
          *   question.skill_tag
          *
          * Fallback:
          *   game.target_skill
          *
          * This protects us if the generator provides the skill
          * at Game level but misses it on an individual question.
          * ======================================================
          */

          const skillTag =
            tile.skill_tag ||
            game.target_skill ||
            null;

          /*
          * ======================================================
          * DEBUG
          * ======================================================
          */

          console.log(
            "[LUMORA UPLOAD] Question:",
            index + 1,
            {
              game: game.game_name,
              tileSkill: tile.skill_tag,
              gameSkill: game.target_skill,
              finalSkill: skillTag,
            }
          );

          /*
          * ======================================================
          * TILE PAYLOAD
          * ======================================================
          */

          return {
            tileid: "",
            gameid: gameId,
            qno: index + 1,

            type: "mcq",

            question: tile.question,

            questionTip: tile.reason
              ? tile.reason
              : "",

            correct: `${correctOption}`,

            /*
            * OPTIONS
            */

            op1: tile?.option1
              ? tile.option1
              : tile.type === "true-false"
                ? "True"
                : "",

            op1Link: "",

            op2: tile?.option2
              ? tile.option2
              : tile.type === "true-false"
                ? "False"
                : "",

            op2Link: "",

            op3: tile?.option3 || "",
            op3Link: "",

            op4: tile?.option4 || "",
            op4Link: "",

            op5: "",
            op5Link: "",

            op6: "",
            op6Link: "",

            op7: "",
            op7Link: "",

            op8: "",
            op8Link: "",

            reason: tile.reason
              ? tile.reason
              : "",

            live: "yes",

            /*
            * ====================================================
            * LUMORA METADATA
            * ====================================================
            */

            skill_tag: skillTag,

            has_reasoning_prompt:
              tile.has_reasoning_prompt || false,
          };
        });
      });
    });
  });

  console.log(
    "[LUMORA UPLOAD] Total tiles:",
    tiles.length
  );

  await uploadTiles({
    tiles,
    action: "create",
  });
}