import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { Config } from './models';
import i18n from './locales/i18n';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  async buildMenu(): Promise<Menu> {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const languageConfig = await Config.get('language');
    if (languageConfig.value !== i18n.language) {
      i18n.changeLanguage(languageConfig.value as string);
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  private openGlobalSettings() {
    this.mainWindow.webContents.send('dispatch', {
      type: 'config/setVisible',
      payload: true,
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: i18n.t('menu.App NAme'),
      submenu: [
        {
          label: i18n.t('menu.About'),
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: i18n.t('menu.Services'), submenu: [] },
        {
          label: i18n.t('menu.Global Settings'),
          accelerator: 'Command+S',
          click: () => this.openGlobalSettings(),
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.Hide'),
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: i18n.t('menu.Hide Others'),
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: i18n.t('menu.Show All'), selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: i18n.t('menu.Quit'),
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: i18n.t('menu.View'),
      submenu: [
        {
          label: i18n.t('menu.Reload'),
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: i18n.t('menu.Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: i18n.t('menu.View'),
      submenu: [
        {
          label: i18n.t('menu.Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: i18n.t('menu.Window'),
      submenu: [
        {
          label: i18n.t('menu.Minimize'),
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          label: i18n.t('menu.Close'),
          accelerator: 'Command+W',
          selector: 'performClose:',
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.Bring All to Front'),
          selector: 'arrangeInFront:',
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuView, subMenuWindow];
  }

  buildDefaultTemplate() {
    const templateDefault: MenuItemConstructorOptions[] = [
      {
        label: i18n.t('menu.App Name'),
        submenu: [
          {
            label: i18n.t('menu.Global Settings'),
            accelerator: 'Ctrl+S',
            click: () => this.openGlobalSettings(),
          },
          {
            label: i18n.t('menu.Close'),
            role: 'close',
          },
        ],
      },
      {
        label: i18n.t('menu.View'),
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: i18n.t('menu.Reload'),
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: i18n.t('menu.Toggle Full Screen'),
                  role: 'togglefullscreen',
                  accelerator: 'F11',
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: i18n.t('menu.Toggle Full Screen'),
                  role: 'togglefullscreen',
                  accelerator: 'F11',
                },
              ],
      },
    ];

    return templateDefault;
  }
}
