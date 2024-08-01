enum AgeCategory {
  Young = "young",
  Old = "old",
  Elder = "elder",
}

enum Gender {
  Male = "male",
  Female = "female",
}

interface VoiceModelMapping {
  [key: string]: { [key in Gender]: string };
}

const voiceModelMapping: VoiceModelMapping = {
  [AgeCategory.Young]: {
    [Gender.Male]: "8JVbfL6oEdmuxKn5DK2C",
    [Gender.Female]: "AD3S0eYTo2vFxZoBZino",
  },
  [AgeCategory.Old]: {
    [Gender.Male]: "AD3S0eYTo2vFxZoBZino",
    [Gender.Female]: "QwvsCFsQcnpWxmP1z7V9",
  },
  [AgeCategory.Elder]: {
    [Gender.Male]: "jlxRlLAHFHYYF59Lyibs",
    [Gender.Female]: "hv0qs3BLjcfZpVctM167",
  },
};

export function getVoiceModelId(age: number, gender: Gender): string {
  let category: AgeCategory;

  if (age < 30) {
    category = AgeCategory.Young;
  } else if (age < 60) {
    category = AgeCategory.Old;
  } else {
    category = AgeCategory.Elder;
  }

  return voiceModelMapping[category][gender];
}

export function mapGender(gender: string): Gender {
  switch (gender.toLowerCase()) {
    case "male":
      return Gender.Male;
    case "female":
      return Gender.Female;
    default:
      throw new Error("Invalid gender");
  }
}
