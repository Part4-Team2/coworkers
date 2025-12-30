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
import BtnArrowLeftIcon from "@/app/assets/btn/arrow-left.svg";
import BtnArrowRightIcon from "@/app/assets/btn/arrow-right.svg";
import BtnCalendarIcon from "@/app/assets/btn/calendar.svg";
import BtnDatepickerDefaultIcon from "@/app/assets/btn/datepicker-default.svg";
import BtnDatepickerOnIcon from "@/app/assets/btn/datepicker-on.svg";
import BtnEditLargeIcon from "@/app/assets/btn/edit-large.svg";
import BtnEditSmallIcon from "@/app/assets/btn/edit-small.svg";
import BtnEnterActiveIcon from "@/app/assets/btn/enter-active.svg";
import BtnEnterDefaultIcon from "@/app/assets/btn/enter-default.svg";
import BtnRadioDefaultIcon from "@/app/assets/btn/radio-default.svg";
import BtnRadioOnIcon from "@/app/assets/btn/radio-on.svg";
import GoogleIcon from "@/app/assets/img/google.svg";
import ImgDoneIcon from "@/app/assets/img/img-done.svg";
import ImgTodoIcon from "@/app/assets/img/img-todo.svg";
import KakaotalkIcon from "@/app/assets/img/kakaotalk.svg";
import LogoLargeIcon from "@/app/assets/img/logo_coworkers/logo-large.svg";
import LogoSmallIcon from "@/app/assets/img/logo_coworkers/logo-small.svg";
import ThumbnailTeamIcon from "@/app/assets/img/thumbnail-team.svg";
import SecessionIcon from "@/app/assets/icon/secession.svg";
import MedalIcon from "@/app/assets/icon/medal.svg";
import SearchIcon from "@/app/assets/icon/search.svg";
import HeartIcon from "@/app/assets/icon/heart.svg";

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
  secession: SecessionIcon,
  medal: MedalIcon,
  search: SearchIcon,
  heart: HeartIcon,
  // btn
  btnArrowLeft: BtnArrowLeftIcon,
  btnArrowRight: BtnArrowRightIcon,
  btnCalendar: BtnCalendarIcon,
  btnDatepickerDefault: BtnDatepickerDefaultIcon,
  btnDatepickeron: BtnDatepickerOnIcon,
  btnEditLarge: BtnEditLargeIcon,
  btnEditSmall: BtnEditSmallIcon,
  btnEnterActive: BtnEnterActiveIcon,
  btnEnterDefault: BtnEnterDefaultIcon,
  btnRadioDefault: BtnRadioDefaultIcon,
  btnRadio0n: BtnRadioOnIcon,
  // img
  google: GoogleIcon,
  imgDone: ImgDoneIcon,
  imgTodo: ImgTodoIcon,
  kakaotalk: KakaotalkIcon,
  LogoLarge: LogoLargeIcon,
  logoSmall: LogoSmallIcon,
  thumbnailTeam: ThumbnailTeamIcon,
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
