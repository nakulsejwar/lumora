import { Course } from "@/types/draft";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { generateId } from "./generate-id";
import { getCorrectOptionNumber } from "./get-correct-option";
import { getRandomImage } from "./get-random-image";
export default async function exportCSV(data: Course) {
  const wb = new Workbook();
  const course = wb.addWorksheet("CourseTemplate");
  const topic = wb.addWorksheet("TopicTemplate");
  const level = wb.addWorksheet("LevelTemplate");
  const game = wb.addWorksheet("Games");
  const tile = wb.addWorksheet("TileTemplate");

  const courseId = generateId(data.course_name);
  course.columns = CourseColumns;
  course.addRow({
    courseid: courseId,
    order: "",
    name: data.course_name,
    ImageLink: getRandomImage(),
    course_tip: data.course_description,
    live: "no",
    action: "create",
  });

  const TopicMap: Record<string, string> = {}; // Map to store topic IDs for each level ID

  topic.columns = TopicColumns;
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
      action: "create",
    };
  });
  topic.addRows(topics);

  level.columns = LevelColumns;

  const levelMap: Record<string, string> = {};
  const levels = data.modules.flatMap((item) => {
    const topicId = TopicMap[item.module_name];
    return item.levels.map((level, index) => {
      const levelId = generateId(level.level_name);
      levelMap[level.level_name] = levelId;
      return {
        level_id: levelId,
        topic_id: topicId,
        order: `${index + 1}`,
        name: level.level_name,
        ImageLink: "",
        level_tip: level.level_description,
        live: "no",
        action: "create",
      };
    });
  });

  level.addRows(levels);

  game.columns = GameColumns;

  const gameMap: Record<string, string> = {};

  const games = data.modules.flatMap((item) => {
    return item.levels.flatMap((level) => {
      if (!level.games) return [];

      const levelId = levelMap[level.level_name];
      return level.games!.map((game, index) => {
        const gameId = generateId(game.game_name);
        gameMap[game.game_name] = gameId;
        return {
          gameid: gameId,
          level_id: levelId,
          order: `${index + 1}`,
          name: game.game_name,
          ImageLink: getRandomImage(),
          gameTip: game.game_description,
          in_gameTip: "",
          live: "no",
          action: "create",
        };
      });
    });
  });

  game.addRows(games);

  tile.columns = TileColumns;

  const tiles = data.modules.flatMap((item) => {
    return item.levels.flatMap((level) => {
      if (!level.games) return [];
      return level.games!.flatMap((game) => {
        if (!game.questions) return [];

        const gameId = gameMap[game.game_name];
        return game.questions!.map((tile, index) => {
          const correctOption = getCorrectOptionNumber(tile, [
            `${tile?.option1}`,
            `${tile?.option2}`,
            `${tile?.option3}`,
            `${tile?.option4}`,
          ]);
          return {
            tileid: "",
            gameid: gameId,
            qno: index + 1,
            type: "mcq",
            question: tile.question,
            questionTip: tile.reason,
            correct: correctOption,
            op1: tile?.option1,
            op1Link: "",
            op2: tile?.option2,
            op2Link: "",
            op3: tile?.option3,
            op3Link: "",
            op4: tile?.option4,
            op4Link: "",
            op5: "",
            op5Link: "",
            op6: "",
            op6Link: "",
            op7: "",
            op7Link: "",
            op8: "",
            op8Link: "",
            reason: tile.reason,
            live: "yes",
            action: "create",
          };
        });
      });
    });
  });

  tile.addRows(tiles);

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `${data.course_name}.xlsx`);
}

const CourseColumns = [
  {
    letter: "A",
    header: "courseid",
    key: "courseid",
  },
  {
    letter: "B",
    header: "order",
    key: "order",
  },
  {
    letter: "C",
    header: "name",
    key: "name",
  },
  {
    letter: "D",
    header: "ImageLink",
    key: "ImageLink",
  },
  {
    letter: "E",
    header: "course_tip",
    key: "course_tip",
  },
  {
    letter: "F",
    header: "live",
    key: "live",
  },
  {
    letter: "G",
    header: "action",
    key: "action",
  },
];

const TopicColumns = [
  {
    letter: "A",
    header: "topic_id",
    key: "topic_id",
  },
  {
    letter: "B",
    header: "courseid",
    key: "courseid",
  },
  {
    letter: "C",
    header: "order",
    key: "order",
  },
  {
    letter: "D",
    header: "name",
    key: "name",
  },
  {
    letter: "E",
    header: "ImageLink",
    key: "ImageLink",
  },
  {
    letter: "F",
    header: "topic_tip",
    key: "topic_tip",
  },
  {
    letter: "G",
    header: "live",
    key: "live",
  },
  {
    letter: "H",
    header: "action",
    key: "action",
  },
];

const LevelColumns = [
  {
    letter: "A",
    header: "level_id",
    key: "level_id",
  },
  {
    letter: "B",
    header: "topic_id",
    key: "topic_id",
  },
  {
    letter: "C",
    header: "order",
    key: "order",
  },
  {
    letter: "D",
    header: "name",
    key: "name",
  },
  {
    letter: "E",
    header: "ImageLink",
    key: "ImageLink",
  },
  {
    letter: "F",
    header: "level_tip",
    key: "level_tip",
  },
  {
    letter: "G",
    header: "live",
    key: "live",
  },
  {
    letter: "H",
    header: "action",
    key: "action",
  },
];

const GameColumns = [
  {
    letter: "A",
    header: "gameid",
    key: "gameid",
  },
  {
    letter: "B",
    header: "level_id",
    key: "level_id",
  },
  {
    letter: "C",
    header: "order",
    key: "order",
  },
  {
    letter: "D",
    header: "name",
    key: "name",
  },
  {
    letter: "E",
    header: "ImageLink",
    key: "ImageLink",
  },
  {
    letter: "F",
    header: "gameTip",
    key: "gameTip",
  },
  {
    letter: "G",
    header: "in_gameTip",
    key: "in_gameTip",
  },
  {
    letter: "H",
    header: "live",
    key: "live",
  },
  {
    letter: "I",
    header: "action",
    key: "action",
  },
];

const TileColumns = [
  { letter: "A", header: "tileid", key: "tileid" },
  { letter: "B", header: "gameid", key: "gameid" },
  { letter: "C", header: "qno", key: "qno" },
  { letter: "D", header: "type", key: "type" },
  { letter: "E", header: "question", key: "question" },
  { letter: "F", header: "questionTip", key: "questionTip" },
  { letter: "G", header: "correct", key: "correct" },
  { letter: "H", header: "op1", key: "op1" },
  { letter: "I", header: "op1Link", key: "op1Link" },
  { letter: "J", header: "op2", key: "op2" },
  { letter: "K", header: "op2Link", key: "op2Link" },
  { letter: "L", header: "op3", key: "op3" },
  { letter: "M", header: "op3Link", key: "op3Link" },
  { letter: "N", header: "op4", key: "op4" },
  { letter: "O", header: "op4Link", key: "op4Link" },
  { letter: "P", header: "op5", key: "op5" },
  { letter: "Q", header: "op5Link", key: "op5Link" },
  { letter: "R", header: "op6", key: "op6" },
  { letter: "S", header: "op6Link", key: "op6Link" },
  { letter: "T", header: "op7", key: "op7" },
  { letter: "U", header: "op7Link", key: "op7Link" },
  { letter: "V", header: "op8", key: "op8" },
  { letter: "W", header: "op8Link", key: "op8Link" },
  { letter: "X", header: "reason", key: "reason" },
  { letter: "Y", header: "live", key: "live" },
  { letter: "Z", header: "action", key: "action" },
];
