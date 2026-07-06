import { readdirSync } from "node:fs";
import { join } from "node:path";
import {
  addComponentExports,
  addComponentsDir,
  createResolver,
  defineNuxtModule,
} from "nuxt/kit";

export interface ShadcnVueOptions {
  /**
   * Prefix for all the imported component
   * @default "Ui"
   */
  prefix: string;

  /**
   * Directory that the component lives in.
   * @default "@/components/ui"
   */
  componentDir: string;
}

export default defineNuxtModule<ShadcnVueOptions>({
  defaults: {
    prefix: "Ui",
    componentDir: "@/components/ui",
  },
  meta: {
    name: "ShadcnVue",
    configKey: "shadcn",
    version: "0.0.1",
    compatibility: {
      nuxt: ">=3.17.0",
    },
  },
  async setup({ componentDir, prefix }, nuxt) {
    const COMPONENT_DIR_PATH = componentDir!;
    const ROOT_DIR_PATH = nuxt.options.rootDir;
    const { resolve, resolvePath } = createResolver(ROOT_DIR_PATH);

    const componentsPath = await resolvePath(COMPONENT_DIR_PATH);

    addComponentsDir({
      path: componentsPath,
      extensions: [],
      ignore: ["**/*"],
    }, {
      prepend: true,
    });

    try {
      await Promise.all(
        readdirSync(componentsPath).map(async (dir) => {
          try {
            const filePath = await resolvePath(
              join(COMPONENT_DIR_PATH, dir, "index"),
              { extensions: [".ts", ".js"] },
            );

            addComponentExports({
              prefix,
              filePath: resolve(filePath),
              priority: 1,
            });
          } catch (err) {
            if (err instanceof Error) {
              console.warn("Module error: ", err.message);
            }
          }
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        console.warn(err.message);
      }
    }
  },
});
