import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public previewImage: string;
  public predictionResult: any[];
  public order = 'desc';
  private customvisionkey: string = 'your key';
  private customvisionpath: string = 'your path';
  public birds: Observable<any>;
  constructor(public navCtrl: NavController, private camera: Camera, public httpClient: HttpClient, public loadingCtrl: LoadingController) {

  }


 
 

  showpreviwandclassify(imageData) {
    this.predictionResult =[];
    console.log(imageData);
    // imageData is either a base64 encoded string or a file URI
    var patt = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$");
    var isbase64 = patt.test(imageData);

    if (isbase64) {
      // If it's base64:
      this.previewImage = 'data:image/jpeg;base64,' + imageData;
    }
    else {
      this.previewImage = imageData;
    }

    this.classify();
  }

  takePicture() {
    console.log("takePicture");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.showpreviwandclassify(imageData);
    }, (err) => {
      // Handle error
    });
  }
  selectImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.showpreviwandclassify(imageData);
    }, (err) => {
      console.log(err);
    });
  }
  getBase64Image(base64string) {
    return base64string.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  sort() {
    this.order = (this.order === 'desc') ? 'asc' : 'desc';
    let result = _.orderBy(this.predictionResult, ['Probability'], [this.order]);
    this.predictionResult = result;


  }
  classify() {
    // update it with your keys
    fetch(this.previewImage)
      .then(res => res.blob())
      .then(blob => {
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();
        let url: string = this.customvisionpath;
        var fd = new FormData();
        fd.append('file', blob);
        let body: any = fd;
        let options: any = {
          headers: {
            'Prediction-Key': this.customvisionkey
            //'Content-Type': 'application/octet-stream'
          }
        };
        this.birds = this.httpClient.post(url, body, options)
        this.birds
          .subscribe(data => {
            loading.dismiss();
            if (data != null && data.Predictions != null) {

              let result = _.orderBy(data.Predictions, ['Probability'], [this.order]);
              this.predictionResult = result;

            }
          })

      }
      )
  }
}
