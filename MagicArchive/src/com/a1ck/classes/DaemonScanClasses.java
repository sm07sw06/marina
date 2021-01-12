package com.a1ck.classes;

public class DaemonScanClasses {

	static class FileClass {
		String file, date, extend;
		long filesize;
		
		public String getFile() {
			return file;
		}
		public void setFile(String file) {
			this.file = file;
		}
		public String getDate() {
			return date;
		}
		public void setDate(String date) {
			this.date = date;
		}
		public String getExtend() {
			return extend;
		}
		public void setExtend(String extend) {
			this.extend = extend;
		}
		public long getFilesize() {
			return filesize;
		}
		public void setFilesize(long filesize) {
			this.filesize = filesize;
		} 
		
	}

	static class JobClass {
		String jobId, jobCd, jobNm, serverId, tableId, filterYn, sourcePath, sourceFile;

		public String getJobId() {
			return jobId;
		}

		public void setJobId(String jobId) {
			this.jobId = jobId;
		}

		public String getJobCd() {
			return jobCd;
		}

		public void setJobCd(String jobCd) {
			this.jobCd = jobCd;
		}
		
		public String getJobNm() {
			return jobNm;
		}

		public void setJobNm(String jobNm) {
			this.jobNm = jobNm;
		}

		public String getServerId() {
			return serverId;
		}

		public void setServerId(String serverId) {
			this.serverId = serverId;
		}

		public String getTableId() {
			return tableId;
		}

		public void setTableId(String tableId) {
			this.tableId = tableId;
		}

		public String getFilterYn() {
			return filterYn;
		}

		public void setFilterYn(String filterYn) {
			this.filterYn = filterYn;
		}

		public String getSourcePath() {
			return sourcePath;
		}

		public void setSourcePath(String sourcePath) {
			this.sourcePath = sourcePath;
		}

		public String getSourceFile() {
			return sourceFile;
		}

		public void setSourceFile(String sourceFile) {
			this.sourceFile = sourceFile;
		}
	}
    
	
}
