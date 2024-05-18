/**
 * for subtraction minutes
 */
function subtractHours(date, minutes) {
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}

export { subtractHours };
