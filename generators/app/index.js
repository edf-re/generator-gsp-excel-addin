'use strict';

const path = require('path');

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const glob = require('glob');

function normalizeTemplatePath(templatePath) {
  return templatePath.replace(/[/\\]/g, path.sep);
}
function getTemplateOutputPath(templatePath, templateReadPath) {
  return normalizeTemplatePath(templatePath).replace(templateReadPath, '');
}
function getTemplateWritePath(templatePath, templateReadPath, destinationPath) {
  const outputPath = getTemplateOutputPath(templatePath, templateReadPath).replace('.tpl', '');
  return path.join(destinationPath, outputPath);
}

module.exports = class extends Generator {

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the GSP Excel Taskpane Addin Generator!`
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
        this.props.projectName = props.projectFullName.replace(/\s+/gi, '-').toLowerCase();

        this.env.cwd = `${this.props.projectName}-addin`
      });
  }

  writing() {
    const separator = path.sep;
    const filePattern = `${this.templatePath()}${separator}**${separator}!(*.tpl.*)`;
    const templatePattern = `${this.templatePath()}${separator}**${separator}*.tpl.*`;

    const filePaths = glob.sync(filePattern);
    const templatePaths = glob.sync(templatePattern);

    this.fs.copy(filePaths, this.destinationPath());

    templatePaths.forEach((templatePath) => {
      const templateWritePath = getTemplateWritePath(
        templatePath,
        this.templatePath(),
        this.destinationPath());

      this.fs.copyTpl(templatePath, templateWritePath, this.props);
    });
  }

  install() {
    process.chdir(this.env.cwd);
    // this.spawnCommand('npm', ['install']);
  }
};
