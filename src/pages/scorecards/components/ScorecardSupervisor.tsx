import { FormHelperText, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TypeAhead } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardSupervisorProps {
  element: ScorecardElement;
}

export default function ScorecardSupervisor({ element }: ScorecardSupervisorProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext();

  return (
    <Stack spacing={2}>
      <TypeAhead
        {...register(`${element.id}.stringValue`, { required: "Supervisor is required" })}
        handleChange={(v) => setValue(`${element.id}.stringValue`, v?.value ?? null)}
        watch={watch}
        fieldName={`${element.id}.stringValue`}
        valueList={[]}
        labelKey="label"
        valueKey="value"
        placeholder="Select supervisor"
      />
      {errors[`${element.id}.stringValue`] && (
        <FormHelperText error>
          {String(errors[`${element.id}.stringValue`]?.message)}
        </FormHelperText>
      )}
    </Stack>
  );
}

const USERS = {
  data: {
    users: [
      {
        username: "MOGLERFARMS\\ALEX",
        name: "Alex Ita",
        __typename: "User"
      },
      {
        username: "APP",
        name: "App",
        __typename: "User"
      },
      {
        username: "AHAYENGA",
        name: "Austin Hayenga",
        __typename: "User"
      },
      {
        username: "JALONS",
        name: "Joy Alons",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\RODNEY",
        name: "Rodney",
        __typename: "User"
      },
      {
        username: "AMADIZ",
        name: "Amadiz",
        __typename: "User"
      },
      {
        username: "WPETERS",
        name: "Wes Peters",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\SOLUTIONDYNAMICS",
        name: "",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\KENT",
        name: "Kent",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\LOIS",
        name: "Lois Mogler",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\CADE",
        name: "Cade Knobloch",
        __typename: "User"
      },
      {
        username: "TPETERSEN",
        name: "Tim Petersen",
        __typename: "User"
      },
      {
        username: "PATTIA",
        name: "Patti",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\JANAE",
        name: "Janae",
        __typename: "User"
      },
      {
        username: "HUNTER",
        name: "Hunter Koolstra",
        __typename: "User"
      },
      {
        username: "ALEUTHOLD",
        name: "Adam Leuthold",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\MATTW",
        name: "Matt Woelfel",
        __typename: "User"
      },
      {
        username: "KYLEK",
        name: "Kyle Knoblock",
        __typename: "User"
      },
      {
        username: "AMY",
        name: "Amy Hettinga",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\KENDRA",
        name: "Kendra Ita",
        __typename: "User"
      },
      {
        username: "SHOEKSTRA",
        name: "Scott Hoekstra",
        __typename: "User"
      },
      {
        username: "PTHOLE",
        name: "Paul Thole",
        __typename: "User"
      },
      {
        username: "DMOSER",
        name: "Dustin Moser",
        __typename: "User"
      },
      {
        username: "JGIL",
        name: "Jose Cano Gil",
        __typename: "User"
      },
      {
        username: "BDEBOER",
        name: "Bradon DeBoer",
        __typename: "User"
      },
      {
        username: "JANAE",
        name: "Janae Metzger",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\BMETZGER",
        name: "Brian Metzger",
        __typename: "User"
      },
      {
        username: "DRECK",
        name: "Dustin Reck",
        __typename: "User"
      },
      {
        username: "LVANROEKEL",
        name: "Larry VanRoekel",
        __typename: "User"
      },
      {
        username: "CRISTOBAL",
        name: "Cristobal Velez Gonzale",
        __typename: "User"
      },
      {
        username: "MPOTTEBAUM",
        name: "Marty Pottebaum",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\AMY",
        name: "Amy Hettinga",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\APRIL",
        name: "April Monen",
        __typename: "User"
      },
      {
        username: "MICAH",
        name: "Micah Metzger",
        __typename: "User"
      },
      {
        username: "SSCHEMMEL",
        name: "Steve Schemmel",
        __typename: "User"
      },
      {
        username: "VANCE",
        name: "Vance",
        __typename: "User"
      },
      {
        username: "DEVAN",
        name: "Devan",
        __typename: "User"
      },
      {
        username: "HVANWYHE",
        name: "Halden Van Wyhe",
        __typename: "User"
      },
      {
        username: "BJ",
        name: "BJ VanRoekel",
        __typename: "User"
      },
      {
        username: "TEVANS",
        name: "Tiffany Evans",
        __typename: "User"
      },
      {
        username: "JHANSEN",
        name: "John Hansen",
        __typename: "User"
      },
      {
        username: "LIZ",
        name: "Lizeth Serrano Rosas",
        __typename: "User"
      },
      {
        username: "APRIL",
        name: "April Monen",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\STONERIDGE1",
        name: "Stoneridge Support 1",
        __typename: "User"
      },
      {
        username: "MPETERS",
        name: "Mitch Peters",
        __typename: "User"
      },
      {
        username: "JUSTIN",
        name: "Justin",
        __typename: "User"
      },
      {
        username: "ROSE",
        name: "Rosalee Anderson",
        __typename: "User"
      },
      {
        username: "BOEKE",
        name: "Matt Boeke",
        __typename: "User"
      },
      {
        username: "LEVIK",
        name: "Levi Kuperschmidt",
        __typename: "User"
      },
      {
        username: "LMEYER",
        name: "Laura Meyer",
        __typename: "User"
      },
      {
        username: "GBERG",
        name: "Gerald Berg",
        __typename: "User"
      },
      {
        username: "JHURTIG",
        name: "Justin Hurtig",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\ADRIAN",
        name: "Adrian Rocke",
        __typename: "User"
      },
      {
        username: "MSTEINEKE",
        name: "Marcus Steineke",
        __typename: "User"
      },
      {
        username: "GDENHOED",
        name: "Gerald Den Hoed",
        __typename: "User"
      },
      {
        username: "RIER",
        name: "Rier Mogler",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\BRIAN",
        name: "Brian Mogler",
        __typename: "User"
      },
      {
        username: "BFICK",
        name: "Bruce Fick",
        __typename: "User"
      },
      {
        username: "EMMA",
        name: "Emma Knobloch",
        __typename: "User"
      },
      {
        username: "BRUGS",
        name: "Matt Bruggeman",
        __typename: "User"
      },
      {
        username: "JVANZEE",
        name: "Jody Van Zee",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\CHET",
        name: "Chet",
        __typename: "User"
      },
      {
        username: "KMOSER",
        name: "Kathy Moser",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\STONERIDGE2",
        name: "Stoneridge Support 2",
        __typename: "User"
      },
      {
        username: "LWATTERSON",
        name: "Lindsay Watterson",
        __typename: "User"
      },
      {
        username: "BHOOGENDOORN",
        name: "Brent Hoogendoorn",
        __typename: "User"
      },
      {
        username: "CGERBER",
        name: "Carl Gerber",
        __typename: "User"
      },
      {
        username: "ERICAM",
        name: "Erica Metzger",
        __typename: "User"
      },
      {
        username: "SAWYER",
        name: "Sawyer Hrdlicka",
        __typename: "User"
      },
      {
        username: "JKIEL",
        name: "Jeff Kiel",
        __typename: "User"
      },
      {
        username: "KKUYPER",
        name: "Korrie Kuyper",
        __typename: "User"
      },
      {
        username: "JENNA",
        name: "Jenna Van Ginkel",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\ADMINISTRATOR",
        name: "",
        __typename: "User"
      },
      {
        username: "JASON",
        name: "Jason Balster",
        __typename: "User"
      },
      {
        username: "GREGG",
        name: "Gregg Metzger",
        __typename: "User"
      },
      {
        username: "LOREN",
        name: "Loren Van Roekel",
        __typename: "User"
      },
      {
        username: "REECE",
        name: "Reece",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\MICAHM",
        name: "Micah Mogler",
        __typename: "User"
      },
      {
        username: "SDORHOUT",
        name: "Steve Dorhout",
        __typename: "User"
      },
      {
        username: "DIEGO",
        name: "Diego Lara Cruz",
        __typename: "User"
      },
      {
        username: "BLEUTHOLD",
        name: "Brent Leuthold",
        __typename: "User"
      },
      {
        username: "CMARCO",
        name: "Curt Marco",
        __typename: "User"
      },
      {
        username: "ZACH",
        name: "Zach Klaassen",
        __typename: "User"
      },
      {
        username: "CVANROEKEL",
        name: "Chuck VanRoekel",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\ANGIE",
        name: "Angie Metzger",
        __typename: "User"
      },
      {
        username: "EUITTENBOGAARD",
        name: "Eric Uittenbogaard",
        __typename: "User"
      },
      {
        username: "MLAIS",
        name: "Mike Lais",
        __typename: "User"
      },
      {
        username: "PHW",
        name: "PHW",
        __typename: "User"
      },
      {
        username: "MHOOGLAND",
        name: "Mike Hoogland",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\ROSS",
        name: "Ross",
        __typename: "User"
      },
      {
        username: "DBERG",
        name: "Dan Berg",
        __typename: "User"
      },
      {
        username: "DREWK",
        name: "Drew Kupferschmid",
        __typename: "User"
      },
      {
        username: "AARON",
        name: "Aaron Metzger",
        __typename: "User"
      },
      {
        username: "EVAN",
        name: "Evan",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\ULTRA",
        name: "",
        __typename: "User"
      },
      {
        username: "DDEBOER",
        name: "Dawson DeBoer",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\DWIGHT",
        name: "Dwight",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\CASEY",
        name: "Casey Morgan",
        __typename: "User"
      },
      {
        username: "CHRIS",
        name: "Chris Sievers",
        __typename: "User"
      },
      {
        username: "DUDEBOER",
        name: "Dustin DeBoer",
        __typename: "User"
      },
      {
        username: "JEDUARDO",
        name: "Jose Eduardo",
        __typename: "User"
      },
      {
        username: "ERICK",
        name: "Eric Kupferschmid",
        __typename: "User"
      },
      {
        username: "CASEY",
        name: "Casey Morgan",
        __typename: "User"
      },
      {
        username: "KALENK",
        name: "Kalen Kuyper",
        __typename: "User"
      },
      {
        username: "MARVH",
        name: "Marv Hoogland",
        __typename: "User"
      },
      {
        username: "ADAM",
        name: "Adam Knoblock",
        __typename: "User"
      },
      {
        username: "CHET",
        name: "Chet Mogler",
        __typename: "User"
      },
      {
        username: "DODEBOER",
        name: "Doug DeBoer",
        __typename: "User"
      },
      {
        username: "MOGLERFARMS\\JEFF",
        name: "Jeff Kiel",
        __typename: "User"
      }
    ]
  }
};
