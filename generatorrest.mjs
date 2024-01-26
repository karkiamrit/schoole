import fs from 'fs';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import util from 'util';
import ora from 'ora';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const createEntityFileText = (
  name,
  createdAt,
  updatedAt,
  typeOfId,
  coulumn,
  type,
  check,
) => {
  return [
    `import {`,
    `  Column, Entity, PrimaryGeneratedColumn,`,
    `${createdAt ? 'CreateDateColumn,' : ''}`,
    `${updatedAt ? 'UpdateDateColumn,' : ''}`,
    `} from 'typeorm';`,
    ``,
    `@Entity()`,
    `export class ${capitalize(name)} {`,
    `  @PrimaryGeneratedColumn('${typeOfId}', ${
      typeOfId === 'increment' ? '{ type: "bigint" }' : ''
    })`,
    `  id: ${typeOfId === 'increment' ? 'number' : 'string'};`,
    ``,
    `  @Column(${check === 'optional' ? '{ nullable: true }' : ''})`,
    `  ${coulumn}${check === 'optional' ? '?' : ''}: ${type};`,
    ``,
    ...(createdAt
      ? [
          `  @CreateDateColumn({`,
          `    type: 'timestamp with time zone',`,
          `  })`,
          `  created_at: Date;`,
          ``,
        ]
      : []),
    ...(updatedAt
      ? [
          `  @UpdateDateColumn({`,
          `    type: 'timestamp with time zone',`,
          `  })`,
          `  updated_at: Date;`,
          ``,
        ]
      : []),
    `};`,
    ``,
  ].join('\n');
};
const createInputText = (name, coulumn, type, check) => {
  return [
    `import { IsNotEmpty, IsOptional } from 'class-validator';`,
    ``,
    `export class Create${capitalize(name)}Input {`,
    `  ${check === 'optional' ? '@IsOptional()' : '@IsNotEmpty()'}`,
    `  ${coulumn}${check === 'optional' ? '?' : ''}: ${type};`,
    `};`,
    ``,
    `export class Update${capitalize(name)}Input {`,
    `  @IsOptional()`,
    `  ${coulumn}${check === 'optional' ? '?' : ''}: ${type};`,
    `};`,
    ``,
  ].join('\n');
};
const createResolverModuleText = (name, typeOfId) => {
  return [
    `import { Controller, Get, Post, Put, Delete } from '@nestjs/common';`,
    `import { ${capitalize(name)}Service } from './${name}.service';`,
    `import { Create${capitalize(name)}Input, Update${capitalize(
      name,
    )}Input } from './inputs/${name}.input';`,
    `import { ${capitalize(name)} } from './entities/${name}.entity';`,
    ``,
    `@Controller('${name}')`,
    `export class ${capitalize(name)}Controller {`,
    `  constructor(private readonly ${name}Service: ${capitalize(
      name,
    )}Service) {}`,
    ``,
    `  @Get()`,
    `  getAll(): Promise<${capitalize(name)}[]> {`,
    `    return this.${name}Service.getAll();`,
    `  }`,
    ``,
    `  @Get(':id')`,
    `  getOne(@Param('id') id: ${
      typeOfId === 'increment' ? 'number' : 'string'
    }): Promise<${capitalize(name)} | undefined> {`,
    `    return this.${name}Service.getOne(id);`,
    `  }`,
    ``,
    `  @Post()`,
    `  create(@Body() input: Create${capitalize(
      name,
    )}Input): Promise<${capitalize(name)} | undefined> {`,
    `    return this.${name}Service.create(input);`,
    `  }`,
    ``,
    `  @Put(':id')`,
    `  update(@Param('id') id: ${
      typeOfId === 'increment' ? 'number' : 'string'
    }, @Body() input: Update${capitalize(name)}Input): Promise<${capitalize(
      name,
    )} | undefined> {`,
    `    return this.${name}Service.update(id, input);`,
    `  }`,
    ``,
    `  @Delete(':id')`,
    `  delete(@Param('id') id: ${
      typeOfId === 'increment' ? 'number' : 'string'
    }): Promise<${capitalize(name)} | undefined> {`,
    `    return this.${name}Service.delete(id);`,
    `  }`,
    `}`,
    ``,
  ].join('\n');
};
const createServiceText = (name, typeOfId) => {
  return [
    `import { Injectable } from '@nestjs/common';`,
    `import { ${capitalize(name)}Repository } from './${name}.repository';`,
    `import { ${capitalize(name)} } from './entities/${name}.entity';`,
    `import { Create${capitalize(name)}Input, Update${capitalize(
      name,
    )}Input } from './inputs/${name}.input';`,
    ``,
    `@Injectable()`,
    `export class ${capitalize(name)}Service {`,
    `  constructor(private readonly ${name}Repository: ${capitalize(
      name,
    )}Repository) {}`,
    ``,
    `  getAll(): Promise<${capitalize(name)}[]> {`,
    `    return this.${name}Repository.find();`,
    `  }`,
    ``,
    `  getOne(id: ${
      typeOfId === 'increment' ? 'number' : 'string'
    }): Promise<${capitalize(name)} | undefined> {`,
    `    return this.${name}Repository.findOne(id);`,
    `  }`,
    ``,
    `  create(input: Create${capitalize(name)}Input): Promise<${capitalize(
      name,
    )} | undefined> {`,
    `    const ${name} = this.${name}Repository.create(input);`,
    `    return this.${name}Repository.save(${name});`,
    `  }`,
    ``,
    `  update(id: ${
      typeOfId === 'increment' ? 'number' : 'string'
    }, input: Update${capitalize(name)}Input): Promise<${capitalize(
      name,
    )} | undefined> {`,
    `    const ${name} = this.${name}Repository.findOne(id);`,
    `    if (!${name}) return undefined;`,
    `    Object.assign(${name}, input);`,
    `    return this.${name}Repository.save(${name});`,
    `  }`,
    ``,
    `  delete(id: ${
      typeOfId === 'increment' ? 'number' : 'string'
    }): Promise<${capitalize(name)} | undefined> {`,
    `    const ${name} = this.${name}Repository.findOne(id);`,
    `    if (!${name}) return undefined;`,
    `    await this.${name}Repository.remove(${name});`,
    `    return ${name};`,
    `  }`,
    `}`,
    ``,
  ].join('\n');
};
const createRepositoryText = (name) => {
  return [
    `import { ${capitalize(name)} } from './entities/${name}.entity';`,
    `import { Repository, EntityRepository } from 'typeorm';`,
    ``,
    `@EntityRepository(${capitalize(name)})`,
    `export class ${capitalize(name)}Repository extends Repository<${capitalize(
      name,
    )}> {`,
    `}`,
    ``,
  ].join('\n');
};
const createTestText = (name, type) => {
  // Modify this function based on your testing framework for REST
  return [`// Your REST API controller tests go here`].join('\n');
};
const start = async () => {
  let entityDir;
  const { table, test, coulumnList, typeOfId, coulumn, type, check } =
    await inquirer.prompt([
      // Your existing prompts remain the same
    ]);

  changeAppMpdule(table);

  addEntity(
    entityDir,
    table,
    !coulumnList.includes('createdAt'),
    !coulumnList.includes('updatedAt'),
    typeOfId,
    coulumn,
    type,
    check,
  );

  addSource(table, test, typeOfId);

  // Generate REST API controller file
  fs.writeFileSync(
    `${entityDir}/${table}.controller.ts`,
    createResolverModuleText(table, typeOfId),
  );

  const spinner = ora(
    '🚀  Code formatting...It will take about 10seconds',
  ).start();
  const promisedExec = util.promisify(exec);
  await promisedExec('yarn lint:fix');
  spinner.succeed('🎉  Done!');
};
