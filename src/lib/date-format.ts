import moment from "moment-timezone";

export const formatDateTime = (date: Date): string => {
  const localTimeZone = moment.tz.guess();
  const localMoment = moment(date).tz(localTimeZone);
  const formattedDate = localMoment.format("DD MMM YYYY HH:mm");
  return formattedDate;
};
export const formatDate = (date: Date): string => {
  const localTimeZone = moment.tz.guess();
  const localMoment = moment(date).tz(localTimeZone);
  const formattedDate = localMoment.format("DD MMM YYYY");
  return formattedDate;
};
export const launchDateTime = (date: Date): string => {
  const localTimeZone = moment.tz.guess();
  const localMoment = moment(date).tz(localTimeZone);
  const formattedDate = localMoment.format("YYYY-MM-DD HH:mm:ss");
  return formattedDate;
};
export const formatDateAgo = (date: Date): string => {
  const utcMoment = moment.utc(date);
  const localTimeZone = moment.tz.guess();
  const localMoment = utcMoment.clone().tz(localTimeZone);
  const formattedDate = localMoment.fromNow();
  return formattedDate;
};
