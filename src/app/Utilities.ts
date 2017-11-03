export default class Utilities {
  public static listify(list: string[] | number[], prefix: string = ''): string {
    // If length is 0 or 1, don't bother listing
    if (list.length === 0) {
      return '';
    }
    if (list.length === 1) {
      return prefix + list[0];
    }
    // Everything but the last item
    const firstBit = list.slice(0, -1).join(`, ${prefix}`);
    // If not 2 list with oxford comma (e.g. 'x, y, and z' and 'x and y')
    const finalJoin = list.length === 2 ? ' and ' : ', and ';
    // The last item
    const lastOne = list[list.length - 1];
    return firstBit + finalJoin + lastOne;
  }

  public static pluralize(noun: string, number: number): string {
    return noun + (number !== 1 ? 's' : '');
  }
}
