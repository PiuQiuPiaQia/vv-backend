import { Application } from 'egg';

export default class AppBootHook {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad(): void {
    console.log('🚀 Your APP is launching...');
  }

  configDidLoad(): void {
    // 增加全局错误处理中间件
    this.app.config.coreMiddleware.unshift('errorHandlerMiddleware');
  }

  async serverDidReady(): Promise<void> {
    // Server is listening.
    console.log('✅ Your awesome APP launched');
  }
}
