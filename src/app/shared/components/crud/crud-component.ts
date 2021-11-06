import { FormGroup } from "@angular/forms";

// material
import { MatSnackBar } from "@angular/material/snack-bar";

// aplicação
import { CrudService } from "./crud.service";

export abstract class CrudComponent<T> {

    /**
     * @description Formulário do componente
     */
    public form: FormGroup;

    /**
     * @description Flag que identifica o estado de "carregamento"
     */
    public loading: boolean;

    constructor(
        public service: CrudService<T>,
        public snackBar: MatSnackBar,
    ) {
        this.form = this.criarForm();
        this.loading = false;
    }

    /**
     * @description Cria o form do CRUD
     */
    public abstract criarForm(): FormGroup;

    /**
     * @description Persiste as alteração da inclusão/edição
     * @param isEdicao Flag que indica Update ao invés de Create
     */
    public persistirAlteracoes(isEdicao: boolean): void {
        if (isEdicao) {
            this.atualizar(this.form.getRawValue());
        } else {
            this.salvar(this.form.getRawValue());
        }
    }

    /**
     * @description Executa a validação do form e persiste o registro no banco
     * @param registro Registro que será persistido
     */
    private salvar(registro: T): void {
        if (this.validarForm()) {
            this.loading = true;
            this.service.incluir(registro).subscribe(() => {
                this.loading = false;
                this.snackBar.open('O registro foi incluído com sucesso!', 'Ok');
            }, error => {
                this.loading = false;
                this.snackBar.open(error, 'Ok');
            });
        }
    }

    /**
     * @description Executa a validação do form e atualiza o registro do banco
     * @param registro Registro que será atualizado
     */
     private atualizar(registro: T): void {
        if (this.validarForm()) {
            this.loading = true;
            this.service.atualizar(registro).subscribe(() => {
                this.loading = false;
                this.snackBar.open('As alterações foram salvas com sucesso!', 'Ok');
            }, error => {
                this.loading = false;
                this.snackBar.open(error, 'Ok');
            });
        }
    }

    /**
     * @description Carrega o registro do banco
     * @param registroId Id do registro a ser carregado
     */
    public carregar(registroId: number): void {
        this.loading = true;
        this.service.carregar(registroId).subscribe(res => {
            this.loading = false;
            this.form.reset(res);
        }, error => {
            this.loading = false;
            this.snackBar.open(error, 'Ok');
        });
    }
    
    /**
     * @description Remove o registro do banco
     * @param registroId Id do registro a ser removido
     */
     public remover(registroId: number): void {
        this.loading = true;
        this.service.remover(registroId).subscribe(() => {
            this.loading = false;
            this.snackBar.open('O registro foi excluído com sucesso!', 'Ok');
        }, error => {
            this.loading = false;
            this.snackBar.open(error, 'Ok');
        });
    }

    /**
     * @description Valida o preenchimento do form
     * @returns True se o form for válido
     */
    public validarForm(): boolean {
        this.form.updateValueAndValidity();
        return this.form.valid;
    }

}