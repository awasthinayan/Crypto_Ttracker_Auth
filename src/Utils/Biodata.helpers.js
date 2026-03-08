export const calculateAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age   = now.getFullYear() - birth.getFullYear();
  const m   = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 ? age : null;
};

export const injectCalculatedAge = (data) => {
  // Guard: data must be a plain object
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data ?? {};

  // Guard: personal must be a plain object with a dateOfBirth string
  if (
    data.personal &&
    typeof data.personal === 'object' &&
    !Array.isArray(data.personal) &&
    data.personal.dateOfBirth
  ) {
    return {
      ...data,
      personal: {
        ...data.personal,
        age: calculateAge(data.personal.dateOfBirth),
      },
    };
  }

  return data;
};