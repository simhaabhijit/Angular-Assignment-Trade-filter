import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appConstants, apiEndpoints } from 'src/app/core/constants';
import { ApiResponse } from 'src/app/core/interfaces/ApiResponse';
import { Item } from 'src/app/core/interfaces/Item';
import { Stash } from 'src/app/core/interfaces/Stash';
import { environment } from 'src/environments/environment';
import { RestApiDATAService } from '../../core/services/rest-api-data.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit, OnDestroy {

  appConstants = appConstants;
  apiEndpoints = apiEndpoints;
  aggregatedStashes: ApiResponse = null;
  allAggregatedStashes: Array<ApiResponse> = [];
  viewAllAggregatedStashesFlag: boolean = false;
  stashesWithItems: Array<Stash> = [];
  stashesWitItemsOnDisplay: Array<Stash> = [];
  dataSource = [];
  leagues: Array<string> = [];
  selectedLeagues: FormControl = new FormControl();
  displayedColumns: string[] = ['name', 'typeLine', 'league'];
  itemnameFilter: string = '';
  typeLineFilter: string = '';
  refreshAPIResponeTimeInterval = 30;
  refreshAPIResponeTimer: any;
  aggregatedStashesId: string;
  countdownTimer: any;
  displayCounter: number;

  constructor(private _restApiDataService: RestApiDATAService) { }

  ngOnInit(): void {
    this.getSingleRefreshingAggreatedStash();
  }

  ngOnDestroy(): void {
    // clearing te time intervals
    clearInterval(this.refreshAPIResponeTimer);
    clearInterval(this.countdownTimer);
  }

  getSingleRefreshingAggreatedStash() {

    this.displayCounter = this.refreshAPIResponeTimeInterval - 1;
    this.aggregatedStashesId = this.appConstants.initialStashId;
    this.viewAllAggregatedStashesFlag = false;

    // initial call for specific Aggregated Stashes 
    this.getAggregatedStash(this.aggregatedStashesId);

    // initializing display counter time interval
    this.countdownTimer = setInterval(() => this.displayCounter--, 1000);

    // initializing Refresfing Specific Aggregates Stashes API time interval
    this.refreshAPIResponeTimer = setInterval(() => {
      this.getAggregatedStash(this.aggregatedStashesId);
      this.displayCounter = this.refreshAPIResponeTimeInterval - 1;
    }, this.refreshAPIResponeTimeInterval * 1000);

  }

  getAggregatedStash(aggStashId: string) {
    const url = environment.baseURL + this.apiEndpoints.publicStash + '?id=' + aggStashId;

    this._restApiDataService.getAggregatedStashes(url).subscribe(
      (response: Array<ApiResponse>) => {

        this.refreshStashData();

        if (response && response.length && response[0].stashes && response[0].next_change_id) {

          // store aggregated stash response & next aggregated stash change ID
          this.aggregatedStashes = response && response.length ? response[0] : null;
          this.aggregatedStashesId = this.aggregatedStashes.next_change_id;

          // storing aggregatedStashes which have items
          if (this.aggregatedStashes && this.aggregatedStashes.stashes && this.aggregatedStashes.stashes.length) {
            let stashIndex = 0;

            while (stashIndex < this.aggregatedStashes.stashes.length) {
              if (this.aggregatedStashes.stashes[stashIndex].items && this.aggregatedStashes.stashes[stashIndex].items.length) {
                this.stashesWithItems.push(this.aggregatedStashes.stashes[stashIndex]);
              }
              stashIndex++;
            }

            // retriving leagues in stashes without duplicates
            this.leagues = this.getLeagues(this.stashesWithItems);

            this.stashesWitItemsOnDisplay = JSON.parse(JSON.stringify(this.stashesWithItems));
            // assiging to items to mat-table
            this.dataSource = this.stashesWitItemsOnDisplay.map((stash: Stash) => stash.items).flat();
          }

        } else {
          this.aggregatedStashesId = this.appConstants.initialStashId;
        }
      }
    );
  }

  getAllAggregatedStashes() {
    const url = environment.baseURL + this.apiEndpoints.publicStash;

    this.viewAllAggregatedStashesFlag = true;
    this.allAggregatedStashes = [];

    this.refreshStashData();

    // clearing te time intervals
    clearInterval(this.refreshAPIResponeTimer);
    clearInterval(this.countdownTimer);

    this._restApiDataService.getAggregatedStashes(url).subscribe(
      (response: Array<ApiResponse>) => {

        this.allAggregatedStashes = response && response.length ? response : null;

        let aggregatedStashIndex = 0;
        let individualStashindex = 0;


        // storing aggregatedStashes which have items
        while (individualStashindex < this.allAggregatedStashes[aggregatedStashIndex].stashes.length) {
          if (this.allAggregatedStashes[aggregatedStashIndex].stashes[individualStashindex].items &&
            this.allAggregatedStashes[aggregatedStashIndex].stashes[individualStashindex].items.length) {
            this.stashesWithItems.push(this.allAggregatedStashes[aggregatedStashIndex].stashes[individualStashindex]);
          }

          individualStashindex++;

          if (individualStashindex === this.allAggregatedStashes[aggregatedStashIndex].stashes.length && aggregatedStashIndex < this.allAggregatedStashes.length - 1) {
            aggregatedStashIndex++;
            individualStashindex = 0;
          }
        }

        this.leagues = this.getLeagues(this.stashesWithItems);

        this.stashesWitItemsOnDisplay = JSON.parse(JSON.stringify(this.stashesWithItems));
        // assiging to items to mat-table
        this.dataSource = this.stashesWitItemsOnDisplay.map((stash: Stash) => stash.items).flat();

      }
    );
  }

  // refresh the variables to store new data
  refreshStashData() {

    this.aggregatedStashes = null;
    this.stashesWithItems = [];
    this.stashesWitItemsOnDisplay = [];
    this.leagues = [];
    this.dataSource = [];
    this.itemnameFilter = '';
    this.typeLineFilter = '';
    this.leagues = [];
    this.selectedLeagues.setValue('');

  }

  // retrives in leagues in a aggregated stash 
  getLeagues(stashes: Array<Stash> = []): Array<string> {
    let leagueLookUP = {};
    stashes.map((stash: Stash) => leagueLookUP[stash.league] = leagueLookUP[stash.league] ? leagueLookUP[stash.league]++ : 1);
    return Object.keys(leagueLookUP);
  }

  // filter items with name, typeLine, Leagues 
  filterItems(leagueNames: string[], itemName: string, typeLine: string) {

    let filteredItems = [];

    // check for league filter 
    if (leagueNames.length) {
      let stashIndex = 0;
      let leagueNamesIndex = 0;

      // store for filtered items based ons elected league 
      while (stashIndex < this.stashesWitItemsOnDisplay.length) {
        if (this.stashesWitItemsOnDisplay[stashIndex].league === leagueNames[leagueNamesIndex]) {
          filteredItems.push(this.stashesWitItemsOnDisplay[stashIndex]);
        }

        stashIndex++;

        if (stashIndex === this.stashesWitItemsOnDisplay.length && leagueNamesIndex < leagueNames.length - 1) {
          leagueNamesIndex++;
          stashIndex = 0;
        }
      }

      filteredItems = filteredItems.map((stash: Stash) => stash.items).flat();

    } else {
      filteredItems = this.stashesWitItemsOnDisplay.map((stash: Stash) => stash.items).flat();
    }

    // check for filtered items based given item name & filter the items 
    if (itemName) {
      itemName = itemName.toLowerCase();
      filteredItems = filteredItems.filter((item: Item) => item.name.toLowerCase().includes(itemName));
    }

    // check for filtered items based given item type line & filter the items
    if (typeLine) {
      typeLine = typeLine.toLowerCase();
      filteredItems = filteredItems.filter((item: Item) => item.typeLine.toLowerCase().includes(typeLine));
    }

    this.dataSource = filteredItems;

  }

}
