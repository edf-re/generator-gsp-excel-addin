'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the shining ${chalk.red('generator-gsp-excel-addin')} generator!`
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectFullName',
        message: 'Name of this project (do not include "Addin")',
        validate: (name) => name.trim().length > 0
      }
    ];

    return this.prompt(prompts)
      .then(props => {
        this.props = props;
        this.props.projectSlug = props.projectFullName.replace(/\s+/gi, '-').toLowerCase();
        this.props.projectName = props.projectFullName
          .trim()
          .split(/\s+/gi, '-')
          .map((token, index) => {
            const firstChar = token[0];
            return index > 0
              ? `${firstChar.toUpperCase()}${token.slice(1)}`
              : token;
          })
          .join('');

        this.env.cwd = `${this.props.projectSlug}-addin`
      });
  }

  writing() {
    this.fs.copy(
      this.templatePath(),
      this.destinationPath(),
      this.props
    );
  }

  install() {
    process.chdir(this.env.cwd);
    this.spawnCommand('npm', ['install']);
  }
};
