import chalk from 'chalk'


const logging = () =>{

    const log = (args: any) => info(args);

  const info = (args: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleDateString}] [INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args
    );

  const warn = (args: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleDateString}] [INFO]`),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );

  const error = (args: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleDateString}] [INFO]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
}

export default logging