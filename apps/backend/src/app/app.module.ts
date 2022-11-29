import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { PropertiesModule } from './properties/properties.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [ClassesModule, PropertiesModule, WorkspacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
