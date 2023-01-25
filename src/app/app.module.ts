import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameResultsComponent } from './game-results/game-results.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogContentDirective } from './dialog/dialog-content.directive';
import { DialogFooterDirective } from './dialog/dialog-footer.directive';

@NgModule({
  declarations: [AppComponent, TeamStatsComponent, GameResultsComponent, GameStatsComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, DialogComponent, DialogContentDirective, DialogFooterDirective],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
