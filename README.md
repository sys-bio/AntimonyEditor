# Antimony Web Editor: A Web Editor Designed to Support Modeling in the Antimony Modeling Language
## Try it Out: [Antimony Web Editor](https://sys-bio.github.io/AntimonyEditor/)

[![MIT License](https://img.shields.io/github/license/sys-bio/vscode-antimony)](https://github.com/evaxliu/evaxliu.github.io/blob/master/LICENSE)

#### [Repository](https://github.com/evaxliu/evaxliu.github.io)&nbsp;&nbsp;|&nbsp;&nbsp;[Issues](https://github.com/evaxliu/evaxliu.github.io/issues)&nbsp;&nbsp;|&nbsp;&nbsp;[Antimony Reference](https://tellurium.readthedocs.io/en/latest/antimony.html)&nbsp;&nbsp;|&nbsp;&nbsp;[tellurium](https://tellurium.readthedocs.io/en/latest/index.html)

The Antimony Web Editor adds language support for Antimony to the web for building models in Systems Biology.

The current available version is a public beta developed by Eva Liu, Sai Anish Konanki, Edison Hao, Sam Chou, Kevin Nguyen lead by Dr. Joseph Hellerstein, and Dr. Herbert Sauro at the University of Washington. Dr. Joseph Hellerstein is responsible for future releases, please feel free to contact him at josephhellerstein@gmail.com if you have any questions.

Please note that the current release does not support the complete Antimony grammar as it is a very early public beta. More will be included in future releases. As of this moment, syntax coloring, Antimony grammar, browse biomodels and uploading/editing multiple files is supported. Flux balance constraints and submodeling are not supported yet.

## HARMONY 2024 Presentation: [Link](https://drive.google.com/file/d/1xLGDqEDlmKoTLwq6wk05reqBkIwBp5LQ/view?usp=sharing)
<img width="500" alt="image" src="https://github.com/sys-bio/AntimonyEditor/assets/69877857/3200293f-3c82-4693-bfa2-4ccbcf5ac630">

## Features
The extension provides many convenient features for developing biological models with the Antimony language in tellurium. The current release focuses on the areas below.

### 1. Syntax Recognition and Color Coding

<p align=center>
<img width="1100" alt="image" src="https://github.com/sys-bio/AntimonyEditor/assets/69877857/a3087eb6-ddc8-4012-ba96-a88e0e6f65fd">
<br/>
<em>(Syntax Coloring)</em>
</p>

### 2. Hover Messages

<p align=center>
<img width="1100" alt="image" src="https://github.com/sys-bio/AntimonyEditor/assets/69877857/994851ec-0c97-4c7e-bcb8-d8ba629ef2df">
<br/>
<em>(Hovering over species to look up information)</em>
</p>

### 3. Error detection
The editor supports various warning and error detections to help modelers debug their model during development. Our design principle for whether an issue should be a warning or an error entirely depends on the logic of tellurium. Our extension will mark the subject as an error if tellurium throws an error while rendering the model, with a red underline. An example would be calling a function that does not exist (usually due to a typo, which is extremely common during development. Read more in Steve Ma's [thesis)](https://drive.google.com/file/d/1FutuOYgq9Jd_AHqp_z4f2joDavVIURuz/view).

<p align=center>
<img width="1100" alt="image" src="https://github.com/sys-bio/AntimonyEditor/assets/69877857/5d91938a-8c46-4d93-b7d1-785546e3148f">
<br/>
<em>(Typos are extremely common in software development)</em>
</p>

The extension supports a wide range of errors and warnings, and we plan to support more in the upcoming releases. Read more in [issues](https://github.com/sys-bio/AntimonyEditor/issues).

### 4. Support for Annotations
<p align=center>
<img width="1100" alt="image" src="https://github.com/sys-bio/AntimonyEditor/assets/69877857/f1ee785e-8f7e-48c4-8042-028fa331a93e">
<br/>
<em>(Annotations near the end of the model with annotation link included in the hover message)</em>
</p>

