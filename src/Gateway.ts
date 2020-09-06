import * as moment from "moment";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { SimpleResult } from "./Contract";

export async function fetchSimpleResults(
  from: moment.Moment,
  to: moment.Moment
): Promise<SimpleResult[]> {
  const url = `https://stat.ink/@ara_ta3/spl2?filter%5Brule%5D=private-private-any&filter%5Bmap%5D=&filter%5Bweapon%5D=&filter%5Brank%5D=&filter%5Bresult%5D=&filter%5Bhas_disconnect%5D=&filter%5Bterm%5D=term&filter%5Bterm_from%5D=${from.format(
    "YYYY-MM-DD"
  )}+18%3A00%3A00&filter%5Bterm_to%5D=${to.format(
    "YYYY-MM-DD"
  )}+18%3A00%3A00&filter%5Btimezone%5D=Asia%2FTokyo`;

  const response = await fetch(url);
  const body = await response.text();
  const page = await new JSDOM(body);
  const rows = page.window.document.getElementsByClassName("battle-row");
  return Array.from(rows).map((r: HTMLTableRowElement) => {
    const cells = Array.from(r.cells);
    const detailButton: HTMLTableCellElement = cells[0];
    const detailAnchor = detailButton.childNodes[0] as HTMLAnchorElement;
    const result: HTMLTableCellElement = cells.find(
      (c) => c.className === "cell-result"
    );
    return {
      win: result.childNodes[0].textContent === "Won",
      detailUrl: detailAnchor.href,
    };
  });
}
