export default class BaseUtils {
  constructor(data) {
    for (const key in data)
      this[key] = data[key];
  }
}