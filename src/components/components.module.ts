import { NgModule } from '@angular/core';
import { ProfileModal } from './profile-modal/profile-modal';
import { NotificationResponseComponent } from './notification-response/notification-response';
@NgModule({
	declarations: [ProfileModal,
    NotificationResponseComponent],
	imports: [],
	exports: [ProfileModal,
    NotificationResponseComponent]
})
export class ComponentsModule {}
