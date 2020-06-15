import { Injectable } from '@angular/core';
// import { EPAuthService } from '../../../../../core/componets/membership/auth.service';
import { ElasticsearchService } from "../../../search/service/elasticsearch-service/elasticsearch.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private myDocsTitles: string[] = [];

  constructor(private es: ElasticsearchService,
  ) { }

  //user page ts에도 동일한 함수 있음. 차후 idList ts으로 이동하여 합침.
  /**
   * @description id string array을 받아서 해당 id을 문서 제목에 매핑하는 함수
   * @param ids 가 없으면 현재 유저의 myDoc을 받아온다. ids가 있으면 param으로 받은 문서 가져옴
   */
  async convertID2Title(ids: string[]) {
    console.log("in documentn converid 2 table :  ", ids)

    return new Promise((resolve) => {
      this.es.searchByManyId(ids).then(res => {
        let articles = res["hits"]["hits"];
        console.log("in document : articies : ", articles)
        console.log("article len" + articles.length);
        try {


          for (let i = 0; i < articles.length; i++) {
            console.log("i = ", i);
            var id = articles[i]["_id"];
            console.log("in document : id : ", id);
            var idx = ids.indexOf(id);//es에서 받아오는 결과가 asyncronous해서 순서가 틀어진다. 순서 교정. 해당 id을 찾아서 그 index에 넣어준다.
            console.log("in document : idx: ", idx)
            console.log("in document : title : ", articles[i]["_source"]["post_title"][0])
            this.myDocsTitles[idx] = articles[i]["_source"]["post_title"][0];
          }
        }
        catch{
          console.log("error in document convert id 2 table")
        }
        console.log("myDocsTitles len : ", this.myDocsTitles.length);
        console.log("in document : myDocsTitles", this.myDocsTitles);
        resolve(this.myDocsTitles);
      })
      // this.http.post<any>()
    })
  }
}