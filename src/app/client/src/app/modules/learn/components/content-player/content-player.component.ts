import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, UserService, PlayerService } from '@sunbird/core';
import * as _ from 'lodash';
import { ConfigService, IUserData, ResourceService, ToasterService,
  WindowScrollService, NavigationHelperService } from '@sunbird/shared';
@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html',
  styleUrls: ['./content-player.component.css']
})
export class ContentPlayerComponent implements OnInit {
  params: {[key: string]: any; };
  playerConfig: any;
  showIFrameContent = false;
  showError = false;
  errorMessage: string;
  contentData: any;
  constructor(public activatedRoute: ActivatedRoute, public location: Location, public navigationHelperService: NavigationHelperService,
    public userService: UserService, public resourceService: ResourceService, public router: Router,
    public toasterService: ToasterService, public windowScrollService: WindowScrollService, public playerService: PlayerService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.params = params;
      this.userService.userData$.subscribe(
        (user: IUserData) => {
          if (user && !user.err) {
            this.getContent();
          }
      });
    });
  }
  getContent() {
    this.playerService.getContent(this.params.contentId).subscribe(
      (response) => {
        if (response.result.content.status === 'Live' || response.result.content.status === 'Unlisted') {
          this.contentData = response.result.content;
          const contentDetails = {
            contentId: this.params.contentId,
            contentData: this.contentData
          };
          this.playerConfig = this.playerService.getContentPlayerConfig(contentDetails);
          this.windowScrollService.smoothScroll('content-player');
        } else {
          this.toasterService.warning(this.resourceService.messages.imsg.m0027);
          this.close();
        }
      },
      (err) => {
        this.showError = true;
        this.errorMessage = this.resourceService.messages.stmsg.m0009;
    });
  }
  tryAgain() {
    this.showError = false;
    this.getContent();
  }
  close () {
    console.log(this.navigationHelperService.getPreviousUrl());
    const previousUrl = this.navigationHelperService.getPreviousUrl();
    if (previousUrl === 'home') {
      this.router.navigate(['resources']);
    } else {
      this.router.navigate([previousUrl]);
    }
  }
}
