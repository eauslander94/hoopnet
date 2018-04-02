import { NgModule } from '@angular/core';
import { ProfileModal } from './profile-modal/profile-modal';
import { NotificationResponse } from './notification-response/notification-response';
@NgModule({
	declarations: [ProfileModal,
    NotificationResponse],
	imports: [],
	exports: [ProfileModal,
    NotificationResponse]
})
export class ComponentsModule {}
