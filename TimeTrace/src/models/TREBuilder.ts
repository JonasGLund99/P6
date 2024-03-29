import { TREParam } from './TREParam';
export class TREBuilder {
    TREParams: TREParam[] = [];
    TREString: string = ""


    buildTRE(TREString: string): string {
        this.TREString = TREString;

        for (const TreParam of this.TREParams) {
            this.TREString += TreParam.convertToTre();
        }

        return this.TREString;
    }
}

