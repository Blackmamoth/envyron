import type { EnumVariableTypes } from "@envyron/types";
import { DURATION_REGEX, FILEPATH_REGEX } from "../../constants";

const JSONMapType = `type JSONMap map[string]any

func (j *JSONMap) Decode(value string) error {
	return json.Unmarshal([]byte(value), j)
}\n\n`;

const EmailType = `type Email string

func (e *Email) Decode(value string) error {
	emailRegex := regexp.MustCompile(\`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$\`)
	if !emailRegex.MatchString(value) {
		return fmt.Errorf("invalid email format: %s", value)
	}
	*e = Email(value)
	return nil
}\n\n`;

const URLType = `type URL string

func (u *URL) Decode(value string) error {
	urlRegex := regexp.MustCompile("(?i)^https?://[^\s/$.?#].[^\s]*$")
	if !urlRegex.MatchString(value) {
		return fmt.Errorf("invalid URL format: %s", value)
	}
	*u = URL(value)
	return nil
}
`;

const DurationType = `type Duration string

func (d *Duration) Decode(value string) error {
	durationRegex := regexp.MustCompile(\`${DURATION_REGEX}\`)
	if !durationRegex.MatchString(value) {
		return fmt.Errorf("invalid Duration format: %s. Use e.g. 30s, 5m, 2h, 7d.", value)
	}
	*d = Duration(value)
	return nil
}\n\n`;

const FilepathType = `type Filepath string

func (f *Filepath) Decode(value string) error {
	filepathRegex := regexp.MustCompile(\`${FILEPATH_REGEX}\`)
	if !filepathRegex.MatchString(value) {
		return fmt.Errorf("invalid file path format: %s", value)
	}
	*f = Filepath(value)
	return nil
}\n\n`;

export const customTypes: { [key in EnumVariableTypes]: string } = {
  STRING: "",
  INT: "",
  FLOAT: "",
  BOOLEAN: "",
  URL: URLType,
  EMAIL: EmailType,
  DURATION: DurationType,
  FILEPATH: FilepathType,
  ARRAY: "",
  JSON: JSONMapType,
};
