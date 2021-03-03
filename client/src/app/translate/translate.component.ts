import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {
  langs = {
    'en-US': 'English',
    'zh-CN': '中文简体'
  };
  constructor(private translate: TranslateService) {
    translate.addLangs(['en-US', 'zh-CN']);
    translate.setDefaultLang('zh-CN');
    const browerLanguage = translate.getBrowserLang();
    console.log(browerLanguage);
    switch (browerLanguage) {
     case 'en':
      translate.use('en-US');
      break;
       case 'zh':
        translate.use('zh-CN');
        break;
     default:
      translate.use('en-US');
      break;
   }
   }

  ngOnInit(): void {
  }

  useLanguage(language: string): void {

    this.translate.use(language);
  }
}
