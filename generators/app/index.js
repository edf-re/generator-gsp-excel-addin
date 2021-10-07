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
        message: 'Full name of this project (do not include "addin")',
        validate: (name) => name.trim().length > 0
      }
    ];

    return this.prompt(prompts)
      .then(props => {
        this.props = props;
        this.props.projectName = props.projectFullName.replace(/\s+/gi, '-').toLowerCase();
        this.env.cwd = `${this.props.projectName}-addin`
      });
  }

  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {}
};
