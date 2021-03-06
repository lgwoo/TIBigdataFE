import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityRootComponent } from './community-root/community-root.component';
import { QnaComponent } from './qna/qna.component';
import { WriteCommunityDocComponent } from './write-community-doc/write-community-doc.component';
import { ReadCommunityDocComponent } from "./read-community-doc/read-community-doc.component";
import { AnnouncementComponent } from "./announcement/announcement.component";
import { FAQComponent } from "./faq/faq.component";
import { ModCommunityDocComponent } from './mod-community-doc/mod-community-doc.component';
import { AuthGuard } from 'src/app/modules/communications/fe-backend-db/membership/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: CommunityRootComponent,
    children: [
      {
        path: "qna",
        component: QnaComponent
      },
      {
        path: "newDoc",
        component: WriteCommunityDocComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "readDoc",
        component: ReadCommunityDocComponent
      },
      {
        path: "announcement",
        component: AnnouncementComponent
      },
      {
        path: "faq",
        component: FAQComponent
      },
      {
        path: "modDoc",
        component: ModCommunityDocComponent,
        canActivate: [AuthGuard],
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule { }
