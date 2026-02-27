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

  console.log({ USERS });

  return (
    <Stack spacing={2}>
      <TypeAhead
        {...register(`${element.id}.stringValue`, { required: "Supervisor is required" })}
        handleChange={(v) => setValue(`${element.id}.stringValue`, v?.value ?? null)}
        watch={watch}
        fieldName={`${element.id}.stringValue`}
        valueList={USERS}
        labelKey="name"
        valueKey="username"
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

const USERS = [
  {
    username: "MOGLERFARMS\\ALEX",
    name: "Alex Ita"
  },
  {
    username: "APP",
    name: "App"
  },
  {
    username: "AHAYENGA",
    name: "Austin Hayenga"
  },
  {
    username: "JALONS",
    name: "Joy Alons"
  },
  {
    username: "MOGLERFARMS\\RODNEY",
    name: "Rodney"
  },
  {
    username: "AMADIZ",
    name: "Amadiz"
  },
  {
    username: "WPETERS",
    name: "Wes Peters"
  },
  {
    username: "MOGLERFARMS\\SOLUTIONDYNAMICS",
    name: ""
  },
  {
    username: "MOGLERFARMS\\KENT",
    name: "Kent"
  },
  {
    username: "MOGLERFARMS\\LOIS",
    name: "Lois Mogler"
  },
  {
    username: "MOGLERFARMS\\CADE",
    name: "Cade Knobloch"
  },
  {
    username: "TPETERSEN",
    name: "Tim Petersen"
  },
  {
    username: "PATTIA",
    name: "Patti"
  },
  {
    username: "MOGLERFARMS\\JANAE",
    name: "Janae"
  },
  {
    username: "HUNTER",
    name: "Hunter Koolstra"
  },
  {
    username: "ALEUTHOLD",
    name: "Adam Leuthold"
  },
  {
    username: "MOGLERFARMS\\MATTW",
    name: "Matt Woelfel"
  },
  {
    username: "KYLEK",
    name: "Kyle Knoblock"
  },
  {
    username: "AMY",
    name: "Amy Hettinga"
  },
  {
    username: "MOGLERFARMS\\KENDRA",
    name: "Kendra Ita"
  },
  {
    username: "SHOEKSTRA",
    name: "Scott Hoekstra"
  },
  {
    username: "PTHOLE",
    name: "Paul Thole"
  },
  {
    username: "DMOSER",
    name: "Dustin Moser"
  },
  {
    username: "JGIL",
    name: "Jose Cano Gil"
  },
  {
    username: "BDEBOER",
    name: "Bradon DeBoer"
  },
  {
    username: "JANAE",
    name: "Janae Metzger"
  },
  {
    username: "MOGLERFARMS\\BMETZGER",
    name: "Brian Metzger"
  },
  {
    username: "DRECK",
    name: "Dustin Reck"
  },
  {
    username: "LVANROEKEL",
    name: "Larry VanRoekel"
  },
  {
    username: "CRISTOBAL",
    name: "Cristobal Velez Gonzale"
  },
  {
    username: "MPOTTEBAUM",
    name: "Marty Pottebaum"
  },
  {
    username: "MOGLERFARMS\\AMY",
    name: "Amy Hettinga"
  },
  {
    username: "MOGLERFARMS\\APRIL",
    name: "April Monen"
  },
  {
    username: "MICAH",
    name: "Micah Metzger"
  },
  {
    username: "SSCHEMMEL",
    name: "Steve Schemmel"
  },
  {
    username: "VANCE",
    name: "Vance"
  },
  {
    username: "DEVAN",
    name: "Devan"
  },
  {
    username: "HVANWYHE",
    name: "Halden Van Wyhe"
  },
  {
    username: "BJ",
    name: "BJ VanRoekel"
  },
  {
    username: "TEVANS",
    name: "Tiffany Evans"
  },
  {
    username: "JHANSEN",
    name: "John Hansen"
  },
  {
    username: "LIZ",
    name: "Lizeth Serrano Rosas"
  },
  {
    username: "APRIL",
    name: "April Monen"
  },
  {
    username: "MOGLERFARMS\\STONERIDGE1",
    name: "Stoneridge Support 1"
  },
  {
    username: "MPETERS",
    name: "Mitch Peters"
  },
  {
    username: "JUSTIN",
    name: "Justin"
  },
  {
    username: "ROSE",
    name: "Rosalee Anderson"
  },
  {
    username: "BOEKE",
    name: "Matt Boeke"
  },
  {
    username: "LEVIK",
    name: "Levi Kuperschmidt"
  },
  {
    username: "LMEYER",
    name: "Laura Meyer"
  },
  {
    username: "GBERG",
    name: "Gerald Berg"
  },
  {
    username: "JHURTIG",
    name: "Justin Hurtig"
  },
  {
    username: "MOGLERFARMS\\ADRIAN",
    name: "Adrian Rocke"
  },
  {
    username: "MSTEINEKE",
    name: "Marcus Steineke"
  },
  {
    username: "GDENHOED",
    name: "Gerald Den Hoed"
  },
  {
    username: "RIER",
    name: "Rier Mogler"
  },
  {
    username: "MOGLERFARMS\\BRIAN",
    name: "Brian Mogler"
  },
  {
    username: "BFICK",
    name: "Bruce Fick"
  },
  {
    username: "EMMA",
    name: "Emma Knobloch"
  },
  {
    username: "BRUGS",
    name: "Matt Bruggeman"
  },
  {
    username: "JVANZEE",
    name: "Jody Van Zee"
  },
  {
    username: "MOGLERFARMS\\CHET",
    name: "Chet"
  },
  {
    username: "KMOSER",
    name: "Kathy Moser"
  },
  {
    username: "MOGLERFARMS\\STONERIDGE2",
    name: "Stoneridge Support 2"
  },
  {
    username: "LWATTERSON",
    name: "Lindsay Watterson"
  },
  {
    username: "BHOOGENDOORN",
    name: "Brent Hoogendoorn"
  },
  {
    username: "CGERBER",
    name: "Carl Gerber"
  },
  {
    username: "ERICAM",
    name: "Erica Metzger"
  },
  {
    username: "SAWYER",
    name: "Sawyer Hrdlicka"
  },
  {
    username: "JKIEL",
    name: "Jeff Kiel"
  },
  {
    username: "KKUYPER",
    name: "Korrie Kuyper"
  },
  {
    username: "JENNA",
    name: "Jenna Van Ginkel"
  },
  {
    username: "MOGLERFARMS\\ADMINISTRATOR",
    name: ""
  },
  {
    username: "JASON",
    name: "Jason Balster"
  },
  {
    username: "GREGG",
    name: "Gregg Metzger"
  },
  {
    username: "LOREN",
    name: "Loren Van Roekel"
  },
  {
    username: "REECE",
    name: "Reece"
  },
  {
    username: "MOGLERFARMS\\MICAHM",
    name: "Micah Mogler"
  },
  {
    username: "SDORHOUT",
    name: "Steve Dorhout"
  },
  {
    username: "DIEGO",
    name: "Diego Lara Cruz"
  },
  {
    username: "BLEUTHOLD",
    name: "Brent Leuthold"
  },
  {
    username: "CMARCO",
    name: "Curt Marco"
  },
  {
    username: "ZACH",
    name: "Zach Klaassen"
  },
  {
    username: "CVANROEKEL",
    name: "Chuck VanRoekel"
  },
  {
    username: "MOGLERFARMS\\ANGIE",
    name: "Angie Metzger"
  },
  {
    username: "EUITTENBOGAARD",
    name: "Eric Uittenbogaard"
  },
  {
    username: "MLAIS",
    name: "Mike Lais"
  },
  {
    username: "PHW",
    name: "PHW"
  },
  {
    username: "MHOOGLAND",
    name: "Mike Hoogland"
  },
  {
    username: "MOGLERFARMS\\ROSS",
    name: "Ross"
  },
  {
    username: "DBERG",
    name: "Dan Berg"
  },
  {
    username: "DREWK",
    name: "Drew Kupferschmid"
  },
  {
    username: "AARON",
    name: "Aaron Metzger"
  },
  {
    username: "EVAN",
    name: "Evan"
  },
  {
    username: "MOGLERFARMS\\ULTRA",
    name: ""
  },
  {
    username: "DDEBOER",
    name: "Dawson DeBoer"
  },
  {
    username: "MOGLERFARMS\\DWIGHT",
    name: "Dwight"
  },
  {
    username: "MOGLERFARMS\\CASEY",
    name: "Casey Morgan"
  },
  {
    username: "CHRIS",
    name: "Chris Sievers"
  },
  {
    username: "DUDEBOER",
    name: "Dustin DeBoer"
  },
  {
    username: "JEDUARDO",
    name: "Jose Eduardo"
  },
  {
    username: "ERICK",
    name: "Eric Kupferschmid"
  },
  {
    username: "CASEY",
    name: "Casey Morgan"
  },
  {
    username: "KALENK",
    name: "Kalen Kuyper"
  },
  {
    username: "MARVH",
    name: "Marv Hoogland"
  },
  {
    username: "ADAM",
    name: "Adam Knoblock"
  },
  {
    username: "CHET",
    name: "Chet Mogler"
  },
  {
    username: "DODEBOER",
    name: "Doug DeBoer"
  },
  {
    username: "MOGLERFARMS\\JEFF",
    name: "Jeff Kiel"
  }
];
