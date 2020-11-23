import { temporaryItem } from './temporaryItem.js';

export class VIPbase extends temporaryItem {
  constructor(infos) {
    super(infos)

    this.tier = infos.tier;

    this.roleID = infos.roleID;

    this.allIDs = [ '754453852618489946' ];

  }

  use() {
    return;
  }

  expire(client, user) {
    if(aDB.vip) {
			if(aDB.vipUntil < new Date()) {
				aWcMember.roles.remove(vipRole, 'VIP acaba de expirar');
				aDB.vip = false;
				aDB.vipUntil = null;
			} else if(!hVip) aWcMember.roles.add(vipRole, 'Membro VIP');
		} else if(hVip) aWcMember.roles.remove(vipRole, 'VIP expirado');
  }
}