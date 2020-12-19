import React, { ChangeEvent } from "react";
import {observer} from "mobx-react"
import { AdminPage } from "../../../shared/AdminPage";
import { observable } from "mobx";
import { ApiClient } from "../../../shared/ApiClient";
import { Router, withRouter } from "next/router";

interface IProps {
  router: Router
}

@observer
class ImportPage extends AdminPage<IProps> {
  onChangeFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    this.files = event.target.files;
  }

  constructor(props: IProps) {
    super(props);
  }
 
private readonly fileInputRef = React.createRef<HTMLInputElement>();

@observable
private files: FileList|null = null;

renderTitle() {
  return "Import Firmstep Form";
}

onSubmit = async () => {

  const readAsText = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file)
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });

  const fileContents = JSON.parse(await readAsText(this.files![0]) as string);
  let id = await ApiClient.create("/api/service/import", fileContents, document);
  this.props.router.push(`/admin/service/${encodeURIComponent(id)}`);
}

renderBody() {
                    return                           <form>
     
                               <input type="file" accept="application/json" ref={this.fileInputRef} onChange={this.onChangeFileInput} />
                               <button disabled={this.files?.length !== 1} onClick={this.onSubmit}>Convert</button>


                             </form>
                        
}


}

export default withRouter(ImportPage);
