import type { EnumVariableTypes } from "@envyron/types";
import { DURATION_REGEX, FILEPATH_REGEX } from "../../constants";

const ListType = `def parse_comma_separated(v: Any) -> list[str] | None:
  if v is None:
      return None
  if isinstance(v, str):
      return [item.strip() for item in v.split(",") if item.strip()]
  return v if isinstance(v, list) else None

CommaSeparatedList = Annotated[
    list[str] | None, 
    BeforeValidator(parse_comma_separated),
    Field(description="Comma-separated string that gets parsed into a list")
]\n\n
`;

const JSONDictType = `def parse_json_string(v: Any) -> dict[str, Any] | None:
  if v is None:
      return None
  if isinstance(v, str):
      return json.loads(v)
  return v if isinstance(v, dict) else None

JsonDict = Annotated[
    dict[str, Any] | None,
    BeforeValidator(parse_json_string),
    Field(description="JSON string that gets parsed into a dictionary")
]\n\n
`;

const BoolType = `def parse_bool_string(v: Any) -> bool | None:
  if v is None:
      return None
  if isinstance(v, bool):
      return v
  if isinstance(v, str):
      return v.lower() in ("true", "1", "yes", "on")
  return bool(v)

BoolString = Annotated[
    bool | None,
    BeforeValidator(parse_bool_string),
    Field(description="Boolean value that accepts 'true', '1', 'yes', 'on'")
]\n\n
`;

const DurationType = `def validate_duration(v: str | None) -> str | None:
  """Validate duration format like '30s', '5m', '2h', '1d'"""
  if v is None:
      return None
  if not re.match(r'${DURATION_REGEX}', v):
      raise ValueError(f"Invalid duration format: {v}. Use format like '30s', '5m', '2h', '1d'")
  return v

Duration = Annotated[
    str | None,
    AfterValidator(validate_duration),
    Field(description="Duration string like '30s', '5m', '2h', '1d'")
]\n\n
`;

const FilepathType = `def validate_filepath(v: str | None) -> str | None:
  """Validate filepath is valid format"""
  if v is None:
      return None
  if not re.match(r'${FILEPATH_REGEX}', v):
      raise ValueError(f"Invalid file path: {v}")
  return v

FilePath = Annotated[
    str | None,
    AfterValidator(validate_filepath),
    Field(description="File path string")
]\n\n
`;

export const customTypes: { [key in EnumVariableTypes]: string } = {
  STRING: "",
  INT: "",
  FLOAT: "",
  BOOLEAN: BoolType,
  URL: "",
  EMAIL: "",
  DURATION: DurationType,
  FILEPATH: FilepathType,
  ARRAY: ListType,
  JSON: JSONDictType,
};
