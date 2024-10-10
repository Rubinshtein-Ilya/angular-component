
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({providedIn: 'root'})

export class CatalogTransformEntitiesService {
    apiHost = environment.apiHost
    salesSkillMap = {
        'living-sale': 'жилая',
        'countryside-sale': 'загородная',
        'commerce-sale': 'коммерческая'
    };
    rentsSkillMap = {
        'living-rent': 'жилая',
        'countryside-rent': 'загородная',
        'commerce-rent': 'коммерческая'
    };
    otherSkillMap = {
        'hypotec': 'ипотека',
        'refinance': 'рефинансирование',
        'management': 'управление объектами',
        'building': 'строительство',
        'consulting': 'консультации'
    };
    icons = {
        0: '/assets/icons/catalog/agent-icon.svg',
        1: '/assets/icons/catalog/agency-icon.svg',
        2: '/assets/icons/catalog/builder-icon.svg',
    }

    constructor(){}

    getAvatar(avatarUrl: string, role: number): string {
        if (!avatarUrl) {
            return this.icons[role]; 
        }
        const url = `${this.apiHost}/${avatarUrl}`
        const lastPart = url.split('/');
        const lastPartValue = lastPart[lastPart.length - 1];
        console.log("AVA", this.icons[role])
        return lastPartValue ? url : this.icons[role];
    }
  
    getSkillsText(skills: string[]): string {
        const sales = [];
        const rents = [];
        const credit = [];
        const other = [];
    
        skills.forEach(skill => {
            if (this.rentsSkillMap[skill]) {
                rents.push(this.rentsSkillMap[skill]);
            } else if (this.salesSkillMap[skill]) {
                sales.push(this.salesSkillMap[skill]);
            } else if (skill === 'refinance' || skill === 'hypotec') {
                credit.push(this.otherSkillMap[skill]);
            } else if (this.otherSkillMap[skill]) {
                other.push(this.otherSkillMap[skill]);
            }
        });
    
        let str = '';
    
        if (sales.length === 3 && rents.length === 3) {
            str += `Аренда и продажа недвижимости: ${sales.join(', ')}. `;
        } else {
            if (sales.length) str += `Продажа недвижимости: ${sales.join(', ')}. `;
            if (rents.length) str += `Аренда недвижимости: ${rents.join(', ')}. `;
        }
    
        if (credit.length) str += `Ипотечное кредитование: ${credit.join(', ')}. `;
        if (other.length) str += `Другие услуги: ${other.join(', ')}. `;
    
        return str;
    }
}