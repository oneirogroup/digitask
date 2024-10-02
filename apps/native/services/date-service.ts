import { LangService } from "./lang-service";

export class DateService extends Date {
  static months = {
    az: [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "İyun",
      "İyul",
      "Avqust",
      "Sentyabr",
      "Oktyabr",
      "Noyabr",
      "Dekabr"
    ]
  };

  static getFormats(date: Date) {
    const lang = LangService.getLang();

    return {
      dd: date.getDate().toString().padStart(2, "0"),
      d: date.getDate(),
      mm: date.getMonth() + 1,
      yy: date.getFullYear().toString().slice(-2),
      yyyy: date.getFullYear(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      MM: DateService.months[lang][date.getMonth() + 1]
    };
  }

  format(format: string) {
    const formats = DateService.getFormats(this);
    const keys = Object.keys(formats);
    keys.forEach(key => (format = format.replace(key, formats[key as keyof typeof formats]?.toString() || "")));
    return format;
  }
}
