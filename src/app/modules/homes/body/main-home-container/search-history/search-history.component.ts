import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { map } from 'rxjs/operators';
import * as CanvasJS from "../../../../../../assets/canvasjs.min.js";
import { IpService } from 'src/app/ip.service'

@Component({
  selector: "app-search-history",
  templateUrl: "./search-history.component.html",
  styleUrls: ["./search-history.component.less"],
})
export class SearchHistoryComponent implements OnInit {

  constructor(private http: HttpClient, private ipService: IpService) { }
  private allHstReqUrl = this.ipService.getCommonIp() + ":4000/hst/getTotalHistory";
  private sortHstFreqReqUrl = this.ipService.getCommonIp() + ":4000/hst/getSortFreqHistory";
  private hstFreq: any[];
  private isChartReady: boolean = false;
  ngOnInit() {
    this.getSortHistory().then(() => {
    // this.queryTotalHistory().then(() => {
      console.log("start hist")
      // console.log(this.hstFreq);
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
          text: "지금까지 HOT 한 검색 결과",
        },
        axisY: {
          title: "검색 수",
          includeZero: false,
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            dataPoints:
              this.hstFreq
          },
        ],
      });
      this.isChartReady = true;
      chart.render();
      console.log(this.isChartReady)
    });
  }

  //get total history and how by ABC order
  queryTotalHistory() {
    return new Promise((r) => {
      this.http
        .get<any>(this.allHstReqUrl)
        .subscribe((res) => {
          console.log(res);
          var hst = res.histories;
          var keyArr = hst.map((hstrs) => hstrs.keyword);
          keyArr = keyArr.sort();
          var lenArr = keyArr.length;
          var count = 1;
          var freqTable = [];
          var idxUniq = 0;
          for (var i = 0; i < lenArr - 1; i++) {
            if (keyArr[i] == keyArr[i + 1]) {
              count++;
              continue;
            }
            // freqTable.push(keyArr[i],count);
            freqTable.push({ x: idxUniq, y: count, label: keyArr[i] });
            idxUniq++;
            count = 1;
          }
          this.hstFreq = freqTable;

          r();
        });
    });

    // getTotalHistory
  }

  //get sorted history by frequency
  getSortHistory() {
    return new Promise((r) => {
      this.http
        .get<any>(this.sortHstFreqReqUrl)
        .subscribe((res) => {
          console.log(res);
          
          var freqTable = [];
          for (var i = 0; i < res.length; i++) {
            // res[i][0] //key
            // res[i][1] //freq
            freqTable.push({ x: i, y: res[i][1], label: res[i][0] });
          }

          // var hst = res.histories;
          // var keyArr = hst.map((hstrs) => hstrs.keyword);
          // keyArr = keyArr.sort();
          // var lenArr = keyArr.length;
          // var count = 1;
          // var idxUniq = 0;
          // for (var i = 0; i < lenArr - 1; i++) {
          //   if (keyArr[i] == keyArr[i + 1]) {
          //     count++;
          //     continue;
          //   }
          //   // freqTable.push(keyArr[i],count);
          //   freqTable.push({ x: idxUniq, y: count, label: keyArr[i] });
          //   idxUniq++;
          //   count = 1;
          // }
          this.hstFreq = freqTable;

          r();
        });
    });
  }
}
