import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TeamStatsComponent } from './components/team-stats/team-stats.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogContentDirective } from './components/dialog/dialog-content.directive';
import { DialogFooterDirective } from './components/dialog/dialog-footer.directive';
import { DialogComponent } from './components/dialog/dialog.component';
import { GameResultsComponent } from './components/game-results/game-results.component';
import { GameStatsComponent } from './components/game-stats/game-stats.component';

@NgModule({
  declarations: [AppComponent, TeamStatsComponent, GameResultsComponent, GameStatsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DialogComponent,
    DialogContentDirective,
    DialogFooterDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
