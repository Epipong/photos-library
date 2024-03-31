class Cookie {
  private json: { [key: string]: string };

  constructor(cookieRaw: string) {
    this.json = cookieRaw
      .replace(/\s/g, "")
      .split(";")
      .reduce((acc: { [key: string]: string }, currentCookie) => {
        const indexOfEqual = currentCookie.indexOf("=");
        const key = currentCookie.substring(0, indexOfEqual).trim();
        const val = currentCookie.substring(indexOfEqual + 1).trim();
        acc[key] = val;
        return acc;
      }, {});
  }

  toJSON(): string {
    return JSON.stringify(this.json, null, 2);
  }
}

export { Cookie };
