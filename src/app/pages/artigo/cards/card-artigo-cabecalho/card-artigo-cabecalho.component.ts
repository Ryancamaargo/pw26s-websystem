
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// material
import { MatSnackBar } from '@angular/material/snack-bar';
import { SysAutocompleteControl } from 'src/app/shared/components/autocomplete/sys-autocomplete';

// shared
import { AdvancedCrudCard } from 'src/app/shared/components/crud/advanced-crud-card';
import { AdvancedCrudController } from 'src/app/shared/components/crud/advanced-crud.controller';

// aplicação
import { Artigo } from '../../models/artigo';
import { Categoria } from 'src/app/pages/categoria/models/categoria';
import { CategoriaService } from 'src/app/pages/categoria/categoria.service';
import { MaxLenghtValidator } from 'src/app/shared/validators/max-length-validator';

@Component({
    selector: 'app-card-artigo-cabecalho',
    templateUrl: 'card-artigo-cabecalho.component.html',
    providers: [CategoriaService],
})
export class CardArtigoCabecalhoComponent extends AdvancedCrudCard<Artigo> implements OnInit {

    @ViewChild('chipInput') public palavrasChaveInput!: ElementRef<HTMLInputElement>;
    @ViewChild('categoriaInput') public categoriaInput!: ElementRef<HTMLInputElement>;

    /**
     * @description Classe de controle do auto-complete de categoria
     */
    public categoriaAutocomplete!: SysAutocompleteControl;

    constructor(
        public crudController: AdvancedCrudController<Artigo>,
        public categoriaService: CategoriaService,
        public formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
    ) {
        super(crudController, formBuilder);
    }

    public get tituloControl() {
        return this.form.get('titulo');
    }

    public get descricaoControl() {
        return this.form.get('descricao');
    }

    ngOnInit(): void {
        this.registerControls();
        this.implementChanges();
    }

    private registerControls() {
        this.categoriaAutocomplete = new SysAutocompleteControl(this.categoriaService.pesquisarTodos.bind(this.categoriaService), this.snackBar);
    }

    private implementChanges() {
        this.form.get('categoria')?.valueChanges.subscribe(this.onChangeCategoria.bind(this));
    }

    criarForm(): FormGroup {
        return this.formBuilder.group({
            titulo: [null, [Validators.required, MaxLenghtValidator(80)]],
            descricao: [null, [Validators.required, MaxLenghtValidator(140)]],
            palavrasChave: [null, Validators.required],
            categoria: [null]
        })
    }

    /**
     * @description Executa no change do FormControl de categoria
     */
    public onChangeCategoria(val: Categoria) {
        this.categoriaInput.nativeElement.value = val ? val.descricao : ''; 
    }

    /**
     * @description Filtra o auto-complete de categoria
     */
    public filtrarCategoria() {
        this.categoriaAutocomplete.filtrar(this.categoriaInput.nativeElement.value);
    }

}