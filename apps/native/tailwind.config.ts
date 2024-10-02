import { baseConfig } from "../../tailwind.config";

export default baseConfig.extend({
  content: ["./{app,components}/**/*.{js,jsx,ts,tsx}"]
});
