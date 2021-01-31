import * as orm from '@midwayjs/orm';
import * as swagger from '@midwayjs/swagger';
import { Configuration } from '@midwayjs/decorator';

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
export class ContainerConfiguratin {}
