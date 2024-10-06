import { type Dayjs, isDayjs } from "dayjs";

export class DateService extends Date {
  static months = [
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
  ];

  static days = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"];

  static pronounsDays = {
    beforeYesterday: "Sırağan gün",
    today: "Bu gün",
    yesterday: "Dünən",
    tomorrow: "Sabah",
    afterTomorrow: "Biri gün"
  };

  static getFormats(date: Date) {
    return {
      dd: () => date.getDate().toString().padStart(2, "0"),
      d: () => date.getDate(),
      mm: () => date.getMonth() + 1,
      yyyy: () => date.getFullYear(),
      yy: () => date.getFullYear().toString().slice(-2),
      hh: () => date.getHours().toString().padStart(2, "0"),
      h: () => date.getHours(),
      m: () => date.getMinutes(),
      s: () => date.getSeconds(),
      MM: () => DateService.months[date.getMonth() + 1],
      pr() {
        const today = new DateService();
        const diff = today.diff(date);
        const pronounsDateKey =
          diff.days === 0
            ? "today"
            : diff.days === 1
              ? "yesterday"
              : diff.days === -1
                ? "tomorrow"
                : diff.days === 2
                  ? "afterTomorrow"
                  : diff.days === -2
                    ? "beforeYesterday"
                    : DateService.from(date);

        const formats = this;
        return pronounsDateKey instanceof DateService
          ? "dd MM".split(" ").map(key => formats[key as keyof typeof formats])
          : DateService.pronounsDays[pronounsDateKey];
      }
    };
  }

  static from(date: string | number | Date | Dayjs = new Date()) {
    if (isDayjs(date)) {
      return new DateService(date.toDate());
    }
    return new DateService(date);
  }

  format(format: string) {
    const formats = DateService.getFormats(this);
    const keys = Object.keys(formats);
    const formatFn = (key: string) => formats[key as keyof typeof formats]()?.toString() || "";
    keys.forEach(key => (format = format.replace(key, formatFn(key))));
    return format;
  }

  diff(until: Date) {
    const diff = until.getTime() - this.getTime();
    return {
      seconds: Math.floor(diff / 1000),
      minutes: Math.floor(diff / 1000 / 60),
      hours: Math.floor(diff / 1000 / 60 / 60),
      days: Math.floor(diff / 1000 / 60 / 60 / 24)
    };
  }

  get add() {
    return {
      seconds: (seconds: number) => {
        const newDateService = new DateService(this);
        newDateService.setSeconds(newDateService.getSeconds() + seconds);
        return newDateService;
      },
      minutes: (minutes: number) => {
        const newDateService = new DateService(this);
        newDateService.setMinutes(newDateService.getMinutes() + minutes);
        return newDateService;
      },
      hours: (hours: number) => {
        const newDateService = new DateService(this);
        newDateService.setHours(newDateService.getHours() + hours);
        return newDateService;
      },
      days: (days: number) => {
        const newDateService = new DateService(this);
        newDateService.setDate(newDateService.getDate() + days);
        return newDateService;
      },
      months: (months: number) => {
        const newDateService = new DateService(this);
        newDateService.setMonth(newDateService.getMonth() + months);
        return newDateService;
      },
      years: (years: number) => {
        const newDateService = new DateService(this);
        newDateService.setFullYear(newDateService.getFullYear() + years);
        return newDateService;
      }
    };
  }
}
