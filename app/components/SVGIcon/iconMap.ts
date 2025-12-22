import AlertIcon from "@/app/assets/icon/3/alert.svg";
import GearIcon from "@/app/assets/icon/3/gear.svg";
import GnbMenuIcon from "@/app/assets/icon/3/gnb-menu.svg";
import IconCalendarIcon from "@/app/assets/icon/4/icon-calendar.svg";
import IconRepeatIcon from "@/app/assets/icon/4/icon-repeat.svg";
import IconTimeIcon from "@/app/assets/icon/4/icon-time.svg";
import ArrowLeftIcon from "@/app/assets/icon/arrow/arrow-left.svg";
import ArrowRightIcon from "@/app/assets/icon/arrow/arrow-right.svg";
import CheckboxActiveIcon from "@/app/assets/icon/checkbox/checkbox-active.svg";
import CheckboxDefaultIcon from "@/app/assets/icon/checkbox/checkbox-default.svg";
import ImageIcon from "@/app/assets/icon/image.svg";
import KebabLargeIcon from "@/app/assets/icon/kebab/kebab-large.svg";
import KebabSmallIcon from "@/app/assets/icon/kebab/kebab-small.svg";
import ProgressDoneIcon from "@/app/assets/icon/progress/progress-done.svg";
import ProgressOngoingIcon from "@/app/assets/icon/progress/progress-ongoing.svg";
import RepairLargeIcon from "@/app/assets/icon/repair/repair-large.svg";
import RepairMediumIcon from "@/app/assets/icon/repair/repair-medium.svg";
import RepairSmallIcon from "@/app/assets/icon/repair/repair-small.svg";
import CalendarIcon from "@/app/assets/icon/2/calendar.svg";
import CheckOneIcon from "@/app/assets/icon/2/check-1.svg";
import CommentIcon from "@/app/assets/icon/2/comment.svg";
import DoneIcon from "@/app/assets/icon/2/done.svg";
import ImgIcon from "@/app/assets/icon/2/img.svg";
import ListIcon from "@/app/assets/icon/2/list.svg";
import PlusIcon from "@/app/assets/icon/2/plus.svg";
import TimeIcon from "@/app/assets/icon/2/time.svg";
import UserIcon from "@/app/assets/icon/2/user.svg";
import CheckIcon from "@/app/assets/icon/1/check.svg";
import ToggleIcon from "@/app/assets/icon/1/toggle.svg";
import VisibilityOffIcon from "@/app/assets/icon/1/visibility_off.svg";
import VisibilityOnIcon from "@/app/assets/icon/1/visibility_on.svg";
import XIcon from "@/app/assets/icon/1/x.svg";

export const IconMap = {
  alert: AlertIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  checkOne: CheckOneIcon,
  checkboxActive: CheckboxActiveIcon,
  checkboxDefault: CheckboxDefaultIcon,
  comment: CommentIcon,
  done: DoneIcon,
  gear: GearIcon,
  gnbMenu: GnbMenuIcon,
  iconCalendar: IconCalendarIcon,
  iconRepeat: IconRepeatIcon,
  iconTime: IconTimeIcon,
  image: ImageIcon,
  img: ImgIcon,
  kebabLarge: KebabLargeIcon,
  kebabSmall: KebabSmallIcon,
  list: ListIcon,
  plus: PlusIcon,
  progressDone: ProgressDoneIcon,
  progressOngoing: ProgressOngoingIcon,
  repairLarge: RepairLargeIcon,
  repairMedium: RepairMediumIcon,
  repairSmall: RepairSmallIcon,
  time: TimeIcon,
  toggle: ToggleIcon,
  user: UserIcon,
  visibilityOff: VisibilityOffIcon,
  visibilityOn: VisibilityOnIcon,
  x: XIcon,
} as const;

export const IconSizes = {
  xxs: 16,
  xs: 18,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

export type IconMapTypes = keyof typeof IconMap;
export type IconSizeTypes = keyof typeof IconSizes;
