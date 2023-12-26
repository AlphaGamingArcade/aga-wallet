export const stringToHex = (str) => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const hexValue = charCode.toString(16);

    // Pad with zeros to ensure two-digit representation
    hex += hexValue.padStart(2, '0');
  }
  return hex;
};

export const getDate = (date) => {
  const dateObj = new Date(date);
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('en-US', options);

  const time = date.split("T")[1].split("Z")[0];
  const formattedTime = time.split(":").slice(0, 2).join(":");

  const newDate = `${formattedDate} ${formattedTime}`;
  return newDate;
};
