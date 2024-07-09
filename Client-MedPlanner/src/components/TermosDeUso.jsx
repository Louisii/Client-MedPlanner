// components/TermsOfUseModal.js
import React from 'react';
import Button from './Button';

const TermosDeUsoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
                <h2 className="text-xl font-bold mb-4">Termos de Uso</h2>
                <div className="overflow-y-auto max-h-96 m-4">
                    <div className='m-2'>
                        <p><strong>1. Termos</strong></p>
                        <p className='text-justify'>
                            Ao acessar ao site MedPlanner, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
                        </p>
                    </div>
                    <div className='m-2'>
                        <p><strong>2. Uso de Licença</strong></p>
                        <p className='text-justify'>
                            É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site MedPlanner, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
                            <ul className='list-disc ml-4'>
                                <li>Modificar ou copiar os materiais;</li>
                                <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
                                <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site MedPlanner;</li>
                                <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais;</li>
                                <li>Transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor.</li>
                            </ul>
                            Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por MedPlanner a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso.
                        </p>
                    </div>
                    <div className='m-2'>
                        <p><strong>3. Isenção de responsabilidade</strong></p>
                        <p className='text-justify'>
                            Os materiais no site da MedPlanner são fornecidos 'como estão'. MedPlanner não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
                            Além disso, o MedPlanner não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
                        </p>
                    </div>
                    <div className='m-2'>
                        <p><strong>4. Limitações</strong></p>
                        <p className='text-justify'>
                            Em nenhum caso o MedPlanner ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em MedPlanner, mesmo que MedPlanner ou um representante autorizado da MedPlanner tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a você.
                        </p>
                    </div>
                    <div className='m-2'>
                        <p><strong>5. Precisão dos materiais</strong></p>
                        <p className='text-justify'>
                            Os materiais exibidos no site da MedPlanner podem incluir erros técnicos, tipográficos ou fotográficos. MedPlanner não garante que qualquer material em seu site seja preciso, completo ou atual. MedPlanner pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, MedPlanner não se compromete a atualizar os materiais.
                        </p>
                    </div>
                    <div className='m-2'>
                        <p><strong>6. Modificações</strong></p>
                        <p className='text-justify'>
                            O MedPlanner pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
                        </p>
                    </div>
                    <div className='m-2'>
                        <p><strong>7. Lei aplicável</strong></p>
                        <p className='text-justify'>
                            Estes termos e condições são regidos e interpretados de acordo com as leis do MedPlanner e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
                        </p>
                    </div>
                    <div className='m-2'>
                        <p><strong>Política de Privacidade</strong></p>
                        <p className='text-justify'>
                            Esta Política de Privacidade se refere aos dados pessoais que a MedPlanner poderá obter quando seus usuários utilizam dos serviços prestados durante a navegação dentro de nosso ambiente virtual. Nesta Política de Privacidade, será descrita de que forma serão coletados e armazenados dados a respeito dos usuários, assim como a forma pela qual tais dados poderão ser utilizados e armazenados nos termos da Lei 12.965/2014 (“Marco Civil da Internet”), do Decreto 8.771/2016 e da Lei 13.709/2018 (Lei Geral de Proteção de Dados).
                            Solicitamos informações pessoais apenas quando for realizado o seu cadastro. Os dados solicitados são nome, e-mail, CPF, função, e caso seja médico solicitamos especialidade, CRM e estado. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
                            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                            Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
                            O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
                            Compromisso do Usuário
                            O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o MedPlanner oferece no site e com caráter enunciativo, mas não limitativo:
                            A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;
                            B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, pixbet ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;
                            C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do MedPlanner, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.
                            Mais informações
                            Ao aceitar a presente Política de Privacidade é declarado que todo seu conteúdo foi devidamente lido e aceito, tendo assim todas as cláusulas devidamente validadas pelo usuário para que atuem em pleno vigor.
                            Esta política é efetiva a partir de 10/07/2024.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onClose}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    text={"Fechar"}
                />

            </div>
        </div>
    );
};

export default TermosDeUsoModal;
