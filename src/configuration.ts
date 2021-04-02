import * as orm from '@midwayjs/orm';
import * as swagger from '@midwayjs/swagger';
import { Configuration, App } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { IMidwaySocketIOApplication } from '@midwayjs/socketio';

@Configuration({
  imports: [
    orm, // 加载 orm 组件
    // 加载swagger组件
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
  ],
})
export class AutoConfiguration implements ILifeCycle {
  @App()
  app: IMidwaySocketIOApplication;

  async onReady(): Promise<void> {
    this.app.on('connection', socket => {
      console.log('global connection', socket.id);
    });
  }
}
