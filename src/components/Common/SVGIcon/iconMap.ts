import AlertIcon from "@/assets/icon/3/alert.svg";
import GearIcon from "@/assets/icon/3/gear.svg";
import GnbMenuIcon from "@/assets/icon/3/gnb-menu.svg";
import IconCalendarIcon from "@/assets/icon/4/icon-calendar.svg";
import IconRepeatIcon from "@/assets/icon/4/icon-repeat.svg";
import IconTimeIcon from "@/assets/icon/4/icon-time.svg";
import ArrowLeftIcon from "@/assets/icon/arrow/arrow-left.svg";
import ArrowRightIcon from "@/assets/icon/arrow/arrow-right.svg";
import CheckboxActiveIcon from "@/assets/icon/checkbox/checkbox-active.svg";
import CheckboxDefaultIcon from "@/assets/icon/checkbox/checkbox-default.svg";
import ImageIcon from "@/assets/icon/image.svg";
import KebabLargeIcon from "@/assets/icon/kebab/kebab-large.svg";
import KebabSmallIcon from "@/assets/icon/kebab/kebab-small.svg";
import ProgressDoneIcon from "@/assets/icon/progress/progress-done.svg";
import ProgressOngoingIcon from "@/assets/icon/progress/progress-ongoing.svg";
import RepairLargeIcon from "@/assets/icon/repair/repair-large.svg";
import RepairMediumIcon from "@/assets/icon/repair/repair-medium.svg";
import RepairSmallIcon from "@/assets/icon/repair/repair-small.svg";
import CalendarIcon from "@/assets/icon/2/calendar.svg";
import CheckOneIcon from "@/assets/icon/2/check-1.svg";
import CommentIcon from "@/assets/icon/2/comment.svg";
import DoneIcon from "@/assets/icon/2/done.svg";
import ImgIcon from "@/assets/icon/2/img.svg";
import ListIcon from "@/assets/icon/2/list.svg";
import PlusIcon from "@/assets/icon/2/plus.svg";
import TimeIcon from "@/assets/icon/2/time.svg";
import UserIcon from "@/assets/icon/2/user.svg";
import CheckIcon from "@/assets/icon/1/check.svg";
import ToggleIcon from "@/assets/icon/1/toggle.svg";
import VisibilityOffIcon from "@/assets/icon/1/visibility_off.svg";
import VisibilityOnIcon from "@/assets/icon/1/visibility_on.svg";
import XIcon from "@/assets/icon/1/x.svg";
import BtnArrowLeftIcon from "@/assets/btn/arrow-left.svg";
import BtnArrowRightIcon from "@/assets/btn/arrow-right.svg";
import BtnCalendarIcon from "@/assets/btn/calendar.svg";
import BtnDatepickerDefaultIcon from "@/assets/btn/datepicker-default.svg";
import BtnDatepickerOnIcon from "@/assets/btn/datepicker-on.svg";
import BtnEditLargeIcon from "@/assets/btn/edit-large.svg";
import BtnEditSmallIcon from "@/assets/btn/edit-small.svg";
import BtnEnterActiveIcon from "@/assets/btn/enter-active.svg";
import BtnEnterDefaultIcon from "@/assets/btn/enter-default.svg";
import BtnRadioDefaultIcon from "@/assets/btn/radio-default.svg";
import BtnRadioOnIcon from "@/assets/btn/radio-on.svg";
import GoogleIcon from "@/assets/img/google.svg";
import ImgDoneIcon from "@/assets/img/img-done.svg";
import ImgTodoIcon from "@/assets/img/img-todo.svg";
import KakaotalkIcon from "@/assets/img/kakaotalk.svg";
import LogoLargeIcon from "@/assets/img/logo_coworkers/logo-large.svg";
import LogoSmallIcon from "@/assets/img/logo_coworkers/logo-small.svg";
import ThumbnailTeamIcon from "@/assets/img/thumbnail-team.svg";
import SecessionIcon from "@/assets/icon/secession.svg";
import MedalIcon from "@/assets/icon/medal.svg";
import SearchIcon from "@/assets/icon/search.svg";
import HeartIcon from "@/assets/icon/heart.svg";
import AvatarIcon from "@/assets/icon/avatar.svg";

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
  avatar: AvatarIcon,
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
