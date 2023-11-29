export const formatDate = (timestamp: any) => {
  const dateObject = new Date(timestamp);
  const hours = dateObject.getHours().toString().padStart(2, "0");
  const minutes = dateObject.getMinutes().toString().padStart(2, "0");
  const meridian = parseInt(hours) < 12 ? "AM" : "PM";
  // converting to 12 hours standard
  // padStart() will add 0 as prefix if hrs or mins are single digit
  const formattedHours = (parseInt(hours) % 12 || 12)
    .toString()
    .padStart(2, "0");

  // will return in hours:mins
  return `${formattedHours}:${minutes} ${meridian}`;
};
