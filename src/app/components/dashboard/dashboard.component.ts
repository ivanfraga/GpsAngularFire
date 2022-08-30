import { Component, OnInit, NgZone } from '@angular/core';
import { User } from 'src/app/entities';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public collectionName="geolocation";
  public Users: User[];
  geo: any;
  constructor(
    private auth: AuthserviceService,
    private zone: NgZone,) { }

  ngOnInit(): void {
    this.recargaProcess();
    this.mostrargeo();
    this.updateGeo();
    this.showUsers();
  }
  showUsers(){
    this.auth.showUsers().subscribe((res) =>{
      this.Users = res.map((e) =>{
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as User)
        };
      });
    });
  }
  logout(){
    
    this.auth.logout();
    
  }
  reloadPage() { // click handler or similar
    this.zone.runOutsideAngular(() => {
        location.reload();
    });
  }
  recargaProcess(){
    if(localStorage.getItem("recarga")==="true"){
      console.log("recarga");
      localStorage.setItem("recarga", "");
      this.reloadPage();
    }
    else{
      console.log("no recarga")
    }
  }
  mostrargeo(){
    this.auth.getlocation().then(resp=>{
      localStorage.setItem("longString", `${resp.long}`);
      localStorage.setItem("latiString", `${resp.lati}`);
      
      console.log("longitud: ", localStorage.getItem("longString"));
      console.log("latitud: ", localStorage.getItem("latiString"));
    })
  }
  async delay(n: number){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }
  async updateGeo(){
    await this.delay(15);
    this.auth.updateGeo();
    this.ngOnInit();
  }


}
