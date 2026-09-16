interface LogEvent {
  eventType: string;
  eventData: any; // You can define more specific types for eventData based on the eventType
}

interface SwipeGamePlayedEvent extends LogEvent {
  eventType: "swipe_game_played";
  eventData: {
    cardsSwiped: string[]; // Assuming each card has an ID
  };
}

interface MCQGamePlayedEvent extends LogEvent {
  eventType: "mcq_game_played";
  eventData: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  };
}

interface LoginEvent extends LogEvent {
  eventType: "login";
  eventData: {
    // Add any relevant login event data
  };
}

interface LogoutEvent extends LogEvent {
  eventType: "logout";
  eventData: {
    // Add any relevant logout event data
  };
}

// Example usage:
const swipeGamePlayedEvent: SwipeGamePlayedEvent = {
  eventType: "swipe_game_played",
  eventData: {
    cardsSwiped: ["card1", "card2", "card3"],
  },
};

const mcqGamePlayedEvent: MCQGamePlayedEvent = {
  eventType: "mcq_game_played",
  eventData: {
    questionId: "question1",
    selectedAnswer: "optionA",
    isCorrect: true,
  },
};

const loginEvent: LoginEvent = {
  eventType: "login",
  eventData: {
    // Add login event data
  },
};

const logoutEvent: LogoutEvent = {
  eventType: "logout",
  eventData: {
    // Add logout event data
  },
};
